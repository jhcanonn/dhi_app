'use client'

import React, { useEffect, useState, useRef } from 'react'
import { DhiPatient } from '@models'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useQuery } from '@apollo/client'
import { GET_CLIENTS, PAGE_PATH, parseUrl } from '@utils'
import { FilterMatchMode, PrimeIcons } from 'primereact/api'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { useRouter } from 'next/navigation'
import { Avatar } from 'primereact/avatar'
import { OverlayPanel } from 'primereact/overlaypanel'
import { generateURLAssetsWithToken } from '@utils/url-access-token'

const ClientList = () => {
  const [clients, setClients] = useState<DhiPatient[]>([])
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    documento: { value: null, matchMode: FilterMatchMode.CONTAINS },
    primer_nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    apellido_paterno: { value: null, matchMode: FilterMatchMode.CONTAINS },
    correo: { value: null, matchMode: FilterMatchMode.CONTAINS },
    telefono: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const router = useRouter()

  const goToPage = (pagePath: string) => router.push(pagePath)

  const { data: dataClients, loading: dataClientsLoading } =
    useQuery(GET_CLIENTS)

  useEffect(() => {
    !dataClientsLoading && setClients(dataClients?.pacientes || [])
  }, [dataClients])

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value
    const _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const actionBodyTemplate = (rowData: DhiPatient) => (
    <div className='w-full flex gap-2'>
      <Button
        className='text-sm'
        icon={PrimeIcons.USER_EDIT}
        type='button'
        outlined
        severity='success'
        tooltip='Ver Paciente'
        tooltipOptions={{ position: 'bottom' }}
        onClick={() =>
          goToPage(parseUrl(PAGE_PATH.clientDetail, { id: rowData.id! }))
        }
      />
      <Button
        className='text-sm'
        icon={PrimeIcons.BOOK}
        type='button'
        outlined
        tooltip='Ver Atenciones'
        tooltipOptions={{ position: 'bottom' }}
        severity='help'
        onClick={() =>
          goToPage(parseUrl(PAGE_PATH.clientDataSheet, { id: rowData.id! }))
        }
      />
    </div>
  )

  const imageBodyTemplate = (rowData: DhiPatient) => {
    const op = useRef<OverlayPanel>(null)
    if (rowData?.avatar && rowData?.avatar?.length > 0) {
      const imageUrl = generateURLAssetsWithToken(
        rowData?.avatar[0].directus_files_id?.id,
        { quality: '15', width: '100', height: '100' },
      )
      const imageUrlView = generateURLAssetsWithToken(
        rowData?.avatar[0].directus_files_id?.id,
        { quality: '15' },
      )

      return (
        <div
          onMouseEnter={(e) => op?.current?.toggle(e)}
          onMouseLeave={(e) => op?.current?.toggle(e)}
          className='px-2'
        >
          <Avatar image={imageUrl} size='xlarge' shape='circle' />
          <OverlayPanel ref={op} style={{ width: '350px' }}>
            <img src={imageUrlView} alt={'Foto' + rowData.documento}></img>
          </OverlayPanel>
        </div>
      )
    }
    return (
      <div className='px-2'>
        <Avatar icon='pi pi-user' size='xlarge' shape='circle' />
      </div>
    )
  }

  const renderHeader = () => (
    <div className='flex justify-content-end'>
      <div className='flex w-full md:!w-[30rem]'>
        <span className='p-input-icon-left grow'>
          <i className='pi pi-search' />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Busqueda general'
            className='w-full'
          />
        </span>
      </div>
    </div>
  )

  return (
    <section className='w-full max-w-[100rem] mx-auto px-4'>
      <div className='py-3 flex flex-col md:flex-row justify-between gap-2'>
        <h2 className='text-2xl font-extrabold text-brand border-b-2 flex-grow'>
          Clientes
        </h2>
      </div>
      <Card className='custom-table-card my-4'>
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
          header={renderHeader()}
          loading={dataClientsLoading}
        >
          <Column body={imageBodyTemplate} style={{ minWidth: '18%' }} />
          <Column
            field='documento'
            header='Documento'
            filter
            filterPlaceholder='Buscar por documento'
            style={{ minWidth: '15%' }}
          />
          <Column
            field='primer_nombre'
            header='Nombre'
            filter
            filterPlaceholder='Buscar por nombre'
            style={{ minWidth: '15%' }}
          />
          <Column
            field='apellido_paterno'
            header='Apellido'
            filter
            filterPlaceholder='Buscar por apellido'
            style={{ minWidth: '15%' }}
          />
          <Column
            field='correo'
            header='Correo'
            filter
            filterPlaceholder='Buscar por correo'
            style={{ minWidth: '15%' }}
          />
          <Column
            field='telefono'
            header='Teléfono'
            filter
            filterPlaceholder='Buscar por teléfono'
            style={{ minWidth: '15%' }}
          />
          <Column
            style={{ width: '7%' }}
            headerStyle={{ width: '5rem', textAlign: 'center' }}
            bodyStyle={{ textAlign: 'center', overflow: 'visible' }}
            body={actionBodyTemplate}
          />
        </DataTable>
      </Card>
    </section>
  )
}

export default ClientList
