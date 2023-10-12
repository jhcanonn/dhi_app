'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
  DataTableRowEvent,
  DataTableValueArray,
} from 'primereact/datatable'
import { Toast } from 'primereact/toast'
import { ComingSoon } from '@components/templates'
import moment from 'moment'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { DataSheetEnum } from '@models'
import { FilterMatchMode } from 'primereact/api'

type DataSheetType = {
  name: string
}

type DataSheet = {
  id: number
  type: DataSheetType
  date: string
  professional: string
  sucursal: string
}

const data: DataSheet[] = [
  {
    id: 1,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 2,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 3,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
  {
    id: 4,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 5,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 6,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
  {
    id: 7,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 8,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 9,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
  {
    id: 10,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 11,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 12,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 13,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
  {
    id: 14,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 15,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 16,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
  {
    id: 17,
    type: { name: DataSheetEnum.CONSULTA_PRIMERA_VEZ },
    date: moment().locale('es').format('ll'),
    professional: 'Jair Cañon',
    sucursal: 'Sucursal A',
  },
  {
    id: 18,
    type: { name: DataSheetEnum.CONSULTA_CONTROL },
    date: moment().locale('es').format('ll'),
    professional: 'German Cañon',
    sucursal: 'Sucursal B',
  },
  {
    id: 19,
    type: { name: DataSheetEnum.RISP_AC },
    date: moment().locale('es').format('ll'),
    professional: 'Diana Cañon',
    sucursal: 'Sucursal C',
  },
]

const defaultFilters: DataTableFilterMeta = {
  type: { value: null, matchMode: FilterMatchMode.IN },
}

const MenuDataSheet = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dataSheets, setDataSheets] = useState<DataSheet[]>(data)
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined)
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters)
  const [dataSheetTypes] = useState<DataSheetType[]>(
    Object.values(DataSheetEnum).map(
      (type) =>
        ({
          name: type.toString(),
        }) as DataSheetType,
    ),
  )
  const toast = useRef<Toast>(null)

  const onRowExpand = (event: DataTableRowEvent) => {
    const rowData = event.data as DataSheet
    toast.current?.show({
      severity: 'info',
      summary: 'Ficha expandida',
      detail: rowData.professional,
      life: 3000,
    })
  }

  const onRowCollapse = (event: DataTableRowEvent) => {
    const rowData = event.data as DataSheet
    toast.current?.show({
      severity: 'success',
      summary: 'Ficha minimizada',
      detail: rowData.professional,
      life: 3000,
    })
  }

  const expandAll = () => {
    const _expandedRows: DataTableExpandedRows = {}
    dataSheets.forEach((ds) => (_expandedRows[`${ds.id}`] = true))
    setExpandedRows(_expandedRows)
  }

  const collapseAll = () => {
    setExpandedRows(undefined)
  }

  const allowExpansion = (rowData: DataSheet) => {
    console.log('allowExpansion', { rowData })
    return true
  }

  const showNotification = (text: string) => {
    toast.current?.show({
      severity: 'info',
      summary: text,
      detail: 'Esta funcionalidad estará disponible proximamente.',
      life: 3000,
    })
  }

  const optionsBodyTemplate = (rowData: DataSheet) => {
    console.log('typeBodyTemplate', { rowData })
    return (
      <div className='w-full flex gap-2'>
        <Button
          className='text-sm'
          icon='pi pi-pencil'
          type='button'
          severity='success'
          onClick={() => showNotification('Editar')}
        />
        <Button
          className='text-sm'
          icon='pi pi-trash'
          type='button'
          severity='danger'
          onClick={() => showNotification('Eliminar')}
        />
      </div>
    )
  }

  const rowExpansionTemplate = (data: DataSheet) => {
    console.log('rowExpansionTemplate', { data })
    return <ComingSoon />
  }

  const typeBodyTemplate = (rowData: DataSheet) => {
    console.log('typeBodyTemplate', { type: rowData.type.name })
    return <p>{rowData.type.name}</p>
  }

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

  const initFilters = () => {
    setFilters(defaultFilters)
  }

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

  useEffect(() => {
    initFilters()
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <DataTable
        value={dataSheets}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        onRowExpand={onRowExpand}
        onRowCollapse={onRowCollapse}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey='id'
        filters={filters}
        header={header}
        tableStyle={{ minWidth: '60rem' }}
        paginator
        stripedRows
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        size='small'
        emptyMessage='No se encontraron resultados'
        className='custom-table'
      >
        <Column expander={allowExpansion} style={{ width: '4%' }} />
        <Column field='date' header='Fecha' sortable style={{ width: '17%' }} />
        <Column
          header='Tipo'
          filterField='type'
          showFilterMatchModes={false}
          filterMenuStyle={{ width: '15rem' }}
          style={{ width: '23%' }}
          body={typeBodyTemplate}
          filter
          filterElement={typesFilterTemplate}
        />
        <Column
          field='professional'
          header='Profesional'
          sortable
          style={{ width: '23%' }}
        />
        <Column
          field='sucursal'
          header='Sucursal'
          sortable
          style={{ width: '20%' }}
        />
        <Column
          header='Opciones'
          style={{ width: '13%' }}
          body={optionsBodyTemplate}
        />
      </DataTable>
    </>
  )
}

export default MenuDataSheet
