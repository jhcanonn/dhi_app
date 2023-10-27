'use client'

import React, { useEffect, useState } from 'react'
import { DhiPatient } from '@models'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useQuery } from '@apollo/client'
import { GET_CLIENTS, PAGE_PATH, parseUrl } from '@utils'
import { FilterMatchMode } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'
import { useClientContext } from '@contexts'

const ClientList = () => {
  const [clients, setClients] = useState<DhiPatient[]>([])
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    primer_nombre: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    apellido_paterno: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    documento: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const router = useRouter()

  const goToPage = (pagePath: string) => router.push(pagePath)

  const {
    data: dataClients,
    loading: dataClientsLoading,
    refetch: dataClientsRefetch,
  } = useQuery(GET_CLIENTS)

  useEffect(() => {
    dataClientsRefetch()
  }, [])

  useEffect(() => {
    if (!dataClientsLoading) {
      setClients(dataClients?.pacientes || [])
    }
  }, [dataClients])

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value
    let _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const editClient = (client: DhiPatient) => {
    goToPage(parseUrl(PAGE_PATH.clientDetail, { id: client.id! }))
  }

  const actionBodyTemplate = (rowData: DhiPatient) => {
    return (
      <React.Fragment>
        <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2'
          onClick={() => editClient(rowData)}
        />
      </React.Fragment>
    )
  }

  const renderHeader = () => {
    return (
      <div className='flex justify-content-end'>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Busqueda General'
          />
        </span>
      </div>
    )
  }

  const header = renderHeader()

  return (
    <section className='w-full max-w-[100rem] mx-auto px-4'>
      <div className='py-3 flex flex-col md:flex-row justify-between gap-2'>
        <h2 className='text-2xl font-extrabold text-brand border-b-2 flex-grow'>
          Clientes
        </h2>
      </div>
      <section className='my-4'>
        <div className='flex flex-col'>
          <Card className='custom-table-card'>
            {!dataClientsLoading ? (
              <DataTable
                value={clients}
                emptyMessage='No se encontraron resultados'
                size='small'
                paginator
                rows={8}
                rowsPerPageOptions={[8, 10, 50, 80]}
                tableStyle={{ minWidth: '40rem' }}
                className='custom-table'
                dataKey='documento'
                filters={filters}
                filterDisplay='row'
                globalFilterFields={[
                  'primer_nombre',
                  'apellido_paterno',
                  'documento',
                ]}
                header={header}
              >
                <Column
                  key='documento'
                  field='documento'
                  header='Documento'
                  filter
                  filterPlaceholder='Buscar por Documento'
                  style={{ minWidth: '15%' }}
                />

                <Column
                  key='primer_nombre'
                  field='primer_nombre'
                  header='Nombre'
                  filter
                  filterPlaceholder='Buscar por nombre'
                  style={{ minWidth: '10%' }}
                />

                <Column
                  key='apellido_paterno'
                  field='apellido_paterno'
                  header='Apellido'
                  filter
                  filterPlaceholder='Buscar por Apellido'
                  style={{ minWidth: '10%' }}
                />

                <Column
                  key='correo'
                  field='correo'
                  header='Correo'
                  filter
                  filterPlaceholder='Buscar por Correo'
                  style={{ minWidth: '15%' }}
                />

                <Column
                  key='telefono'
                  field='telefono'
                  header='Teléfono'
                  filter
                  filterPlaceholder='Buscar por Teléfono'
                  style={{ minWidth: '10%' }}
                />
                <Column
                  headerStyle={{ width: '5rem', textAlign: 'center' }}
                  bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
                  body={actionBodyTemplate}
                />
              </DataTable>
            ) : (
              <ProgressSpinner />
            )}
          </Card>
        </div>
      </section>
    </section>
  )
}

export default ClientList
