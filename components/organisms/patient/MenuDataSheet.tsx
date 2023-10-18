'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableValueArray,
} from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { DataSheet, DataSheetDirectus, DataSheetType } from '@models'
import { FilterMatchMode } from 'primereact/api'
import {
  GET_DATASHEETS_BY_ID,
  dhiDataSheetMapper,
  removeDuplicates,
} from '@utils'
import { useQuery } from '@apollo/client'
import { UUID } from 'crypto'
import { useClientContext } from '@contexts'
import { RowExpansionDataSheet } from '@components/molecules'

const defaultFilters: DataTableFilterMeta = {
  type: { value: null, matchMode: FilterMatchMode.IN },
}

const MenuDataSheet = () => {
  const toast = useRef<Toast>(null)
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters)
  const [dataSheetTypes, setDataSheetTypes] = useState<DataSheetType[]>([])
  const { dataSheets, setDataSheets, clientInfo } = useClientContext()

  const { data: dataSheetsData, loading: dataSheetsLoading } = useQuery(
    GET_DATASHEETS_BY_ID,
    {
      variables: { fichaId: clientInfo?.ficha_id?.id },
    },
  )

  const expandAll = () => {
    const _expandedRows: DataTableExpandedRows = {}
    dataSheets.forEach((ds) => (_expandedRows[`${ds.id}`] = true))
    setExpandedRows(_expandedRows)
  }

  const collapseAll = () => {
    setExpandedRows(undefined)
  }

  const showNotification = (text: string, id: UUID) => {
    toast.current?.show({
      severity: 'info',
      summary: text,
      detail: text + ' registro ' + id,
      life: 3000,
    })
  }

  const optionsBodyTemplate = (rowData: DataSheet) => (
    <div className='w-full flex gap-2'>
      <Button
        className='text-sm'
        icon='pi pi-pencil'
        type='button'
        severity='success'
        onClick={() => showNotification('Editar', rowData.id)}
      />
      <Button
        className='text-sm'
        icon='pi pi-trash'
        type='button'
        severity='danger'
        onClick={() => showNotification('Eliminar', rowData.id)}
      />
    </div>
  )

  const rowExpansionTemplate = (data: DataSheet) => (
    <RowExpansionDataSheet data={data} />
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

  const header = (
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

  const initFilters = () => {
    setFilters(defaultFilters)
  }

  useEffect(() => {
    initFilters()
    if (!dataSheetsLoading) {
      const dataSheets: DataSheetDirectus[] =
        dataSheetsData.historico_atenciones
      const tableDataSheets: DataSheet[] = dataSheets.map((ds) =>
        dhiDataSheetMapper(ds),
      )
      setDataSheets(tableDataSheets)
      setDataSheetTypes(removeDuplicates(tableDataSheets.map((t) => t.type)))
    }
  }, [dataSheetsData])

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={dataSheets}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey='id'
        filters={filters}
        header={header}
        paginator
        stripedRows
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        size='small'
        emptyMessage='No se encontraron resultados'
        className='custom-table'
        loading={dataSheetsLoading}
      >
        <Column expander={true} style={{ width: '3%' }} />
        <Column field='date' header='Fecha' sortable style={{ width: '15%' }} />
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

export default MenuDataSheet
