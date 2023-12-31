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
  OptionType,
  StatusDataSheet,
  UpdatedAttention,
} from '@models'
import { FilterMatchMode, PrimeIcons } from 'primereact/api'
import {
  GET_DATASHEETS_BY_ID,
  UPDATE_ATTENTION,
  clientInfoToHeaderDataPDFMapper,
  dhiDataSheetMapper,
  removeDuplicates,
} from '@utils'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useClientContext, useGlobalContext } from '@contexts'
import { EditDataSheet, RowExpansionDataSheet } from '@components/molecules'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Tag } from 'primereact/tag'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { generatePanelToPDF } from '@utils/utils-pdf'
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
  const [dataSheetTypes, setDataSheetTypes] = useState<OptionType[]>([])
  const [updateAttention] = useMutation(UPDATE_ATTENTION)

  const {
    dataSheets,
    setDataSheets,
    clientInfo,
    savingDataSheet,
    setSavingDataSheet,
  } = useClientContext()

  const fichaId = clientInfo?.ficha_id?.id

  const [
    dataSheetsRefetch,
    { data: dataSheetsData, loading: dataSheetsLoading },
  ] = useLazyQuery(GET_DATASHEETS_BY_ID, {
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

  const annulDataSheetHandle = (rowData: DataSheet, tagKey: string) => {
    confirmDialog({
      tagKey,
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

  const optionsBodyTemplate = (rowData: DataSheet) => {
    const tagKey = `annul_${rowData.id}`
    return (
      <div key={tagKey} className='w-full flex gap-2 justify-center'>
        <ConfirmDialog tagKey={tagKey} />
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
              icon={PrimeIcons.PENCIL}
              type='button'
              severity='success'
              tooltip='Editar'
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
              icon={PrimeIcons.TRASH}
              type='button'
              severity='danger'
              tooltip='Anular'
              tooltipOptions={{ position: 'bottom' }}
              onClick={() => annulDataSheetHandle(rowData, tagKey)}
              outlined
            />
            <Button
              className='text-sm'
              icon={PrimeIcons.PRINT}
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
  }

  const rowExpansionTemplate = (data: DataSheet) => (
    <RowExpansionDataSheet data={data} />
  )

  const dateBodyTemplate = (rowData: DataSheet) => (
    <p>{rowData.date.formated}</p>
  )

  const typeBodyTemplate = (rowData: DataSheet) => <p>{rowData.type.name}</p>

  const typesItemTemplate = (option: OptionType) => <p>{option.name}</p>

  const typesFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <MultiSelect
      value={options.value}
      options={dataSheetTypes}
      itemTemplate={typesItemTemplate}
      onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)}
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
    <div className='flex flex-col md:flex-row gap-2 justify-center'>
      <Button
        type='button'
        label='Cerrar'
        icon='pi pi-times'
        severity='danger'
        className='w-full md:w-fit'
        onClick={() => setVisible(false)}
      />
      <Button
        label='Guardar'
        icon='pi pi-save'
        severity='success'
        className='w-full md:w-fit'
        form={`form_${currentRowData?.type.code}_edit_${currentRowData?.id}`}
        loading={savingDataSheet}
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

  const fetchData = async () =>
    await dataSheetsRefetch({ variables: { fichaId } })

  useEffect(() => {
    fichaId ? fetchData() : setDataSheets([])
  }, [fichaId])

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
          style={{ width: '15%', minWidth: '7rem' }}
          sortable
          body={dateBodyTemplate}
        />
        <Column
          header='Tipo'
          filterField='type'
          showFilterMatchModes={false}
          filterMenuStyle={{ width: '15rem' }}
          style={{ width: '20%', minWidth: '10rem' }}
          body={typeBodyTemplate}
          filter
          filterElement={typesFilterTemplate}
        />
        <Column
          field='professional'
          header='Profesional'
          sortable
          style={{ width: '20%', minWidth: '10rem' }}
        />
        <Column
          field='sucursal'
          header='Sucursal'
          sortable
          style={{ width: '30%', minWidth: '15rem' }}
        />
        <Column
          header='Acciones'
          align={'center'}
          style={{ width: '12%' }}
          body={optionsBodyTemplate}
        />
      </DataTable>
    </>
  )
}

export default withToast(MenuDataSheet)
