'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableValueArray,
} from 'primereact/datatable'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import {
  DataSheet,
  DataSheetDirectus,
  DataSheetType,
  StatusDataSheet,
  UpdatedAttention,
} from '@models'
import { FilterMatchMode } from 'primereact/api'
import {
  GET_DATASHEETS_BY_ID,
  UPDATE_ATTENTION,
  clientInfoToHeaderDataPDFMapper,
  dhiDataSheetMapper,
  removeDuplicates,
} from '@utils'
import { useMutation, useQuery } from '@apollo/client'
import { useClientContext, useGlobalContext } from '@contexts'
import { EditDataSheet, RowExpansionDataSheet } from '@components/molecules'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Tag } from 'primereact/tag'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { generatePanelToPDF } from '@utils/panel-to-pdf'
import { withToast } from '@hooks'

const defaultFilters: DataTableFilterMeta = {
  type: { value: null, matchMode: FilterMatchMode.IN },
}

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const MenuDataSheet = ({ showSuccess, showError }: Props) => {
  const { panels } = useGlobalContext()
  const [visible, setVisible] = useState<boolean>(false)
  const [currentRowData, setCurrentRowData] = useState<DataSheet | null>(null)
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters)
  const [dataSheetTypes, setDataSheetTypes] = useState<DataSheetType[]>([])
  const [updateAttention] = useMutation(UPDATE_ATTENTION)

  const {
    dataSheets,
    setDataSheets,
    clientInfo,
    savingDataSheet,
    setSavingDataSheet,
  } = useClientContext()

  const fichaId = clientInfo?.ficha_id?.id

  const {
    data: dataSheetsData,
    loading: dataSheetsLoading,
    refetch: dataSheetsRefetch,
  } = useQuery(GET_DATASHEETS_BY_ID, {
    variables: { fichaId },
  })

  const expandAll = () => {
    const _expandedRows: DataTableExpandedRows = {}
    dataSheets.forEach((ds) => (_expandedRows[`${ds.id}`] = true))
    setExpandedRows(_expandedRows)
  }

  const collapseAll = () => {
    setExpandedRows(undefined)
  }

  const updateAttentionOnTable = (attention: UpdatedAttention) => {
    const updatedDataSheets = dataSheets.map((ds) =>
      ds.id === attention.id ? { ...ds, status: attention.status } : ds,
    )
    setDataSheets(updatedDataSheets)
  }

  const annulDataSheet = async (rowData: DataSheet) => {
    try {
      const result: any = await updateAttention({
        variables: {
          atentionId: rowData.id,
          status: StatusDataSheet.ANNULLED,
        },
      })
      const attention: UpdatedAttention =
        result.data.update_historico_atenciones_item
      if (attention) updateAttentionOnTable(attention)
    } catch (error: any) {
      showError('Error', error.message)
    }
  }

  const annulDataSheetHandle = (rowData: DataSheet) => {
    confirmDialog({
      tagKey: `annul_${rowData.id}`,
      message:
        'La anulación de una atención es irreversible, está seguro(a) que desea seguir?',
      header: 'Confirmación de anulación de atención',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      draggable: false,
      accept: async () => {
        await annulDataSheet(rowData)
      },
    })
  }

  const optionsBodyTemplate = (rowData: DataSheet) => (
    <div className='w-full flex gap-2'>
      <ConfirmDialog tagKey={`annul_${rowData.id}`} />
      {rowData.status === StatusDataSheet.ANNULLED ? (
        <Tag
          severity='danger'
          value='Anulada'
          className='h-fit px-2 py-1 self-center'
          rounded
        />
      ) : (
        <>
          <Button
            className='text-sm'
            icon='pi pi-pencil'
            type='button'
            severity='success'
            tooltip='Editar atención'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => {
              setCurrentRowData(rowData)
              setVisible(true)
              collapseAll()
            }}
            outlined
          />
          <Button
            className='text-sm'
            icon='pi pi-trash'
            type='button'
            severity='danger'
            tooltip='Anular atención'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() => annulDataSheetHandle(rowData)}
            outlined
          />
          <Button
            className='text-sm'
            icon='pi pi-print'
            type='button'
            severity='info'
            tooltip='Imprimir'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() =>
              generatePanelToPDF(
                panels.find((p) => p.code === rowData.type.code),
                rowData.data,
                false,
                clientInfoToHeaderDataPDFMapper(clientInfo as any, rowData),
              )
            }
            outlined
          />
          {/* onClick={() => PanelToPDF(panel, handleForm, false, dataHeader)}*/}
          {/* <Button onClick={() => HtmlToPDF(refForm.current)} >Imprimir</Button> */}
        </>
      )}
    </div>
  )

  const rowExpansionTemplate = (data: DataSheet) => (
    <RowExpansionDataSheet data={data} />
  )

  const dateBodyTemplate = (rowData: DataSheet) => (
    <p>{rowData.date.formated}</p>
  )

  const typeBodyTemplate = (rowData: DataSheet) => <p>{rowData.type.name}</p>

  const typesItemTemplate = (option: DataSheetType) => <p>{option.name}</p>

  const typesFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <MultiSelect
      value={options.value}
      options={dataSheetTypes}
      itemTemplate={typesItemTemplate}
      onChange={(e: MultiSelectChangeEvent) => {
        return options.filterCallback(e.value)
      }}
      optionLabel='name'
      placeholder='Seleccionar'
      className='p-column-filter'
    />
  )

  const headerTable = (
    <div className='flex flex-wrap justify-content-end gap-2'>
      <Button
        icon='pi pi-plus'
        label='Expandir todo'
        className='text-sm'
        onClick={expandAll}
        text
      />
      <Button
        icon='pi pi-minus'
        label='Minimizar todo'
        className='text-sm'
        onClick={collapseAll}
        text
      />
    </div>
  )

  const headerDialog = <h2>Edición {currentRowData?.type.name}</h2>

  const footerDialog = (
    <div className='flex flex-col md:flex-row gap-2 justify-end'>
      <Button
        label='Cerrar'
        severity='danger'
        onClick={() => setVisible(false)}
        className='w-full md:w-fit'
      />
      <Button
        label='Guardar'
        severity='success'
        form={`form_${currentRowData?.type.code}_edit_${currentRowData?.id}`}
        loading={savingDataSheet}
        className='w-full md:w-fit'
      />
    </div>
  )

  const initFilters = () => {
    setFilters(defaultFilters)
  }

  useEffect(() => {
    initFilters()
    if (!dataSheetsLoading) {
      const dataSheets: DataSheetDirectus[] =
        dataSheetsData?.historico_atenciones || []
      const tableDataSheets: DataSheet[] = dataSheets.map((ds) =>
        dhiDataSheetMapper(ds),
      )
      setDataSheets(tableDataSheets)
      setDataSheetTypes(removeDuplicates(tableDataSheets.map((t) => t.type)))
    }
  }, [dataSheetsData])

  useEffect(() => {
    fichaId ? dataSheetsRefetch({ fichaId }) : setDataSheets([])
  }, [])

  return (
    <>
      <Dialog
        header={headerDialog}
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
        footer={footerDialog}
        className='w-[90vw] max-w-[100rem]'
      >
        {currentRowData ? (
          <EditDataSheet
            data={currentRowData}
            onHide={() => {
              setVisible(false)
              setSavingDataSheet(false)
              showSuccess(
                'Atención actualizada',
                'La atención fue actualizada correctamente',
              )
            }}
          />
        ) : (
          <div className='flex justify-center py-4'>
            <ProgressSpinner />
          </div>
        )}
      </Dialog>
      <DataTable
        value={dataSheets.filter((ds) => !!ds.type.code)}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey='id'
        filters={filters}
        header={headerTable}
        paginator
        stripedRows
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        size='small'
        emptyMessage='No se encontraron resultados'
        className='custom-table'
        loading={dataSheetsLoading}
        removableSort
        sortField='date.timestamp'
        sortOrder={-1}
      >
        <Column expander={true} style={{ width: '3%' }} />
        <Column
          field='date.timestamp'
          header='Fecha'
          style={{ width: '15%' }}
          sortable
          body={dateBodyTemplate}
        />
        <Column
          header='Tipo'
          filterField='type'
          showFilterMatchModes={false}
          filterMenuStyle={{ width: '15rem' }}
          style={{ width: '20%' }}
          body={typeBodyTemplate}
          filter
          filterElement={typesFilterTemplate}
        />
        <Column
          field='professional'
          header='Profesional'
          sortable
          style={{ width: '20%' }}
        />
        <Column
          field='sucursal'
          header='Sucursal'
          sortable
          style={{ width: '30%' }}
        />
        <Column
          header='Opciones'
          style={{ width: '12%' }}
          body={optionsBodyTemplate}
        />
      </DataTable>
    </>
  )
}

export default withToast(MenuDataSheet)
