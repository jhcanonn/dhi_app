'use client'

import React, { useEffect, useState, useRef } from 'react'
import { DhiPatient } from '@models'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner'
import { useQuery } from '@apollo/client'
import { GET_CLIENTS, PAGE_PATH, parseUrl } from '@utils'
import { FilterMatchMode, PrimeIcons } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'
import { Avatar } from 'primereact/avatar'
import { OverlayPanel } from 'primereact/overlaypanel'

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
    const _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const actionBodyTemplate = (rowData: DhiPatient) => {
    return  (
      <>
        <Button
          className='text-sm mr-2'
          icon={PrimeIcons.USER_EDIT}
          type='button'
          outlined
          severity='success'
          tooltip="Ver Paciente" tooltipOptions={{ position: 'bottom' }}
          onClick={() =>
            goToPage(parseUrl(PAGE_PATH.clientDetail, { id: rowData.id! }))
          }
        />
        <Button
          className='text-sm mr-2'
          icon={PrimeIcons.BOOK}
          type='button'
          outlined
          tooltip="Ver Atenciones" tooltipOptions={{ position: 'bottom' }}
          severity='danger'
          onClick={() =>
            goToPage(parseUrl(PAGE_PATH.clientDataSheet, { id: rowData.id! }))
          }
        />
      </>
    )
  }
 
  const imageBodyTemplate = (rowData: DhiPatient) => {
    const op = useRef<OverlayPanel>(null)
    if (rowData?.avatar && rowData?.avatar?.length > 0) {
      const imageUrl = `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/${rowData?.avatar[0].directus_files_id?.id}?fit=cover`
      return (
        <div onMouseEnter={(e) => op?.current?.toggle(e)}
        onMouseLeave={(e) => op?.current?.toggle(e)}>
          <Avatar
            image={imageUrl}
            size='xlarge'
            shape='circle'
            
          />

          <OverlayPanel ref={op} style={{ width: "350px" }}>
            <img
              src={imageUrl}
              alt={'Foto'+ rowData.documento}
            ></img>
          </OverlayPanel>
        </div>
      )
    }
    return <Avatar icon='pi pi-user' size='xlarge' shape='circle' />
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
                <Column header='' body={imageBodyTemplate} />

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

                <Column style={{ width: '8%' }}
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
