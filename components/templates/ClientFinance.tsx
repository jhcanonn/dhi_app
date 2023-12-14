'use client'

import {
  FINANCE_CODE,
  GET_INVOICES,
  PAGE_PATH,
  invoiceInitialDataMapper,
  invoicesMapper,
  parseUrl,
} from '@utils'
import { useEffect, useState } from 'react'
import { useGoTo } from '@hooks'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useClientContext } from '@contexts'
import { useLazyQuery } from '@apollo/client'
import { InvoiceType } from '@models'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { PrimeIcons } from 'primereact/api'
import { Dialog } from 'primereact/dialog'
import ClientFinanceForm from './ClientFinanceForm'

const createdDateBodyTemplate = (invoice: InvoiceType) => (
  <p>{invoice.created_date.formated}</p>
)

const itemsBodyTemplate = (invoice: InvoiceType) => (
  <div className='flex flex-wrap gap-2'>
    {invoice.items.map((i) => (
      <span key={i.code}>
        <strong>{i.quantity} x</strong> {i.description}
      </span>
    ))}
  </div>
)

const totalNetoBodyTemplate = (invoice: InvoiceType) => (
  <p>{invoice.monto.formated}</p>
)

const payedBodyTemplate = (invoice: InvoiceType) => (
  <p>{invoice.payed.formated}</p>
)

const debtBodyTemplate = (invoice: InvoiceType) => (
  <p>{invoice.debt.formated}</p>
)

const ClientFinance = () => {
  const [visibleView, setVisibleView] = useState<boolean>(false)
  const [invoices, setInvoices] = useState<InvoiceType[]>([])
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceType | null>(null)

  const { clientInfo } = useClientContext()
  const { goToPage } = useGoTo()

  const [refetchInvoices, { data: dataInvoices, loading: loadingInvoices }] =
    useLazyQuery(GET_INVOICES, {
      variables: { customerId: clientInfo?.id },
    })

  const headerDialog = (
    <section className='flex flex-wrap gap-x-4 text-base md:text-xl'>
      <h2>
        Paciente: <span className='font-normal'>{clientInfo?.full_name}</span>
      </h2>
      <h3>
        Monto:{' '}
        <span className='font-normal'>{currentInvoice?.monto.formated}</span>
      </h3>
    </section>
  )

  const footerDialog = (
    <div className='flex flex-col md:flex-row gap-2 justify-center'>
      <Button
        type='button'
        label='Cerrar'
        icon={PrimeIcons.TIMES}
        severity='danger'
        className='w-full md:w-fit'
        onClick={() => setVisibleView(false)}
      />
    </div>
  )

  const optionsBodyTemplate = (invoice: InvoiceType) => {
    const tagKey = `${FINANCE_CODE}item_${invoice.id}`
    return (
      <div key={tagKey}>
        <ConfirmDialog tagKey={tagKey} />
        <section className='flex gap-2 justify-center'>
          <Button
            icon={PrimeIcons.EYE}
            severity='help'
            tooltip='Ver'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              setVisibleView(true)
              setCurrentInvoice(invoice)
            }}
          />
        </section>
      </div>
    )
  }

  const refreshDataTable = async () =>
    clientInfo &&
    (await refetchInvoices({ variables: { patientId: clientInfo.id } }))

  useEffect(() => {
    refreshDataTable()
  }, [clientInfo])

  useEffect(() => {
    !loadingInvoices &&
      setInvoices(invoicesMapper(dataInvoices?.facturas_siigo || []))
  }, [dataInvoices])

  return (
    <>
      <Dialog
        draggable={false}
        visible={visibleView}
        onHide={() => setVisibleView(false)}
        header={headerDialog}
        footer={footerDialog}
        className='w-[90vw] max-w-[100rem]'
      >
        <ClientFinanceForm
          initialData={
            currentInvoice
              ? invoiceInitialDataMapper(currentInvoice)
              : undefined
          }
        />
      </Dialog>
      <Card className='custom-table-card flex flex-col gap-4'>
        <Button
          className='text-sm w-full md:!w-fit min-w-[13rem]'
          icon='pi pi-plus'
          label='Crear factura'
          type='button'
          severity='success'
          onClick={() => {
            clientInfo?.id &&
              goToPage(parseUrl(PAGE_PATH.financeCreate, { id: clientInfo.id }))
          }}
          outlined
        />
        <DataTable
          value={invoices}
          emptyMessage='No se encontraron resultados'
          size='small'
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '40rem' }}
          className='custom-table'
          loading={loadingInvoices}
          removableSort
          sortField='created_date.timestamp'
          sortOrder={-1}
        >
          <Column
            key='created_date'
            field='created_date.timestamp'
            header='Fecha Creación'
            body={createdDateBodyTemplate}
            style={{ minWidth: '10rem', width: '15%' }}
            sortable
          />
          <Column
            key='items'
            field='items'
            header='Items'
            body={itemsBodyTemplate}
            style={{ minWidth: '20rem', width: '45%' }}
          />
          <Column
            key='total_neto'
            field='total_neto.formated'
            header='Monto'
            body={totalNetoBodyTemplate}
            style={{ minWidth: '9rem', width: '10%' }}
            sortable
          />
          <Column
            key='payed'
            field='payed.formated'
            header='Monto Pagado'
            body={payedBodyTemplate}
            style={{ minWidth: '9rem', width: '10%' }}
            sortable
          />
          <Column
            key='debt'
            field='debt.formated'
            header='Deuda'
            body={debtBodyTemplate}
            style={{ minWidth: '9rem', width: '10%' }}
            sortable
          />
          <Column
            key='options'
            header='Acciones'
            align={'center'}
            style={{ minWidth: '4rem', width: '10%' }}
            body={optionsBodyTemplate}
          />
        </DataTable>
      </Card>
    </>
  )
}

export default ClientFinance
