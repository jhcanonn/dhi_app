'use client'

import {
  DHI_SUCRUSAL,
  FINANCE_CODE,
  GET_INVOICES,
  PAGE_PATH,
  invoiceItemsMapper,
  invoicePaymentWaysMapper,
  invoiceTypesMapper,
  parseUrl,
  regexPatterns,
} from '@utils'
import {
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  InputTextareaValid,
} from '@components/atoms'
import moment from 'moment'
import { BudgetItem, InvoicesDirectus } from '@models'
import { useQuery } from '@apollo/client'
import { useGoTo, withToast } from '@hooks'
import { Card } from 'primereact/card'
import { ReactNode, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { BudgetItems, PaymentWayItems } from '@components/organisms'
import { Button } from 'primereact/button'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { useClientContext } from '@contexts'
import { validTotals } from '@components/organisms/patient/PaymentWayItems'

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
}

const ClientFinance = ({ showSuccess, showWarning }: Props) => {
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState<InvoicesDirectus | null>(null)
  const { clientInfo } = useClientContext()
  const { goToPage } = useGoTo()

  const { data: dataInvoices, loading: loadingInvoices } =
    useQuery(GET_INVOICES)

  const defaultValues: Record<string, any> = {
    [`${FINANCE_CODE}created_date`]: moment().toDate(),
    [`${FINANCE_CODE}sucursal`]: DHI_SUCRUSAL,
    [`${FINANCE_CODE}total_bruto`]: 0,
    [`${FINANCE_CODE}descuentos`]: 0,
    [`${FINANCE_CODE}subtotal`]: 0,
    [`${FINANCE_CODE}iva`]: 0,
    [`${FINANCE_CODE}total_formas_de_pago`]: 0,
    [`${FINANCE_CODE}total_neto`]: 0,
  }
  const handleForm = useForm({ defaultValues })
  const { handleSubmit, getValues } = handleForm

  const onSubmit = () => {
    setLoading(true)
    const saveData = validTotals(handleForm, showWarning, true)
    if (saveData) {
      console.log({ data: getValues(), showSuccess, showWarning })
    }
    setLoading(false)
  }

  useEffect(() => {
    !loadingInvoices && setInvoices(dataInvoices)
  }, [dataInvoices])

  return (
    <Card className='custom-table-card'>
      <form
        id={`form_${FINANCE_CODE}create`}
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 text-sm items-center [&>*]:w-full'
      >
        <div className='!grid grid-cols-1 md:grid-cols-3 gap-x-4 px-2 pt-2'>
          <DropdownValid
            name={`${FINANCE_CODE}type`}
            handleForm={handleForm}
            label='Tipo de Factura'
            list={invoiceTypesMapper(invoices?.siigo_voucher_types || [])}
            required
          />
          <DateTimeValid
            name={`${FINANCE_CODE}created_date`}
            handleForm={handleForm}
            label='Fecha de creación'
            showIcon={false}
            disabled
          />
          <InputTextValid
            name={`${FINANCE_CODE}sucursal`}
            handleForm={handleForm}
            label='Vendedor'
            disabled
          />
        </div>
        <div className='flex flex-col gap-4'>
          <BudgetItems
            key={`${FINANCE_CODE}products_items`}
            handleForm={handleForm}
            fieldsStartCode={FINANCE_CODE}
            legend={BudgetItem.PRODUCTS}
            buttonLabel='Agregar producto'
            list={invoiceItemsMapper(invoices?.siigo_productos || [])}
            invoiceForm
          />
          <BudgetItems
            key={`${FINANCE_CODE}services_items`}
            handleForm={handleForm}
            fieldsStartCode={FINANCE_CODE}
            legend={BudgetItem.SERVICES}
            buttonLabel='Agregar servicio'
            list={invoiceItemsMapper(invoices?.siigo_services || [])}
            invoiceForm
          />
        </div>
        <div className='flex flex-col md:flex-row md:gap-4 mt-3'>
          <div className='flex flex-col w-full md:!w-[70%]'>
            <PaymentWayItems
              key={`${FINANCE_CODE}payment_ways_items`}
              handleForm={handleForm}
              legend={'Formas de Pago'}
              buttonLabel='Agregar forma de pago'
              list={invoicePaymentWaysMapper(
                invoices?.siigo_payment_types || [],
              )}
            />
            <div className='h-5' />
          </div>
          <div className='flex flex-col order-first md:order-last w-full md:!w-[30%] mt-3'>
            <InputNumberValid
              handleForm={handleForm}
              label='Total bruto'
              name={`${FINANCE_CODE}total_bruto`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='[&_input]:text-right'
              disabled
            />
            <InputNumberValid
              handleForm={handleForm}
              label='Descuentos'
              name={`${FINANCE_CODE}descuentos`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='[&_input]:text-right'
              disabled
            />
            <InputNumberValid
              handleForm={handleForm}
              label='Subtotal'
              name={`${FINANCE_CODE}subtotal`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='[&_input]:text-right'
              disabled
            />
            <InputNumberValid
              handleForm={handleForm}
              label='IVA'
              name={`${FINANCE_CODE}iva`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='[&_input]:text-right'
              disabled
            />
          </div>
        </div>
        <div className='flex flex-col gap-2 md:flex-row md:gap-4 mt-3'>
          <div className='flex justify-end w-full md:!w-[70%]'>
            <InputNumberValid
              handleForm={handleForm}
              label='Total formas de pago'
              name={`${FINANCE_CODE}total_formas_de_pago`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='w-full lg:!w-[30rem] [&_input]:text-right [&_input]:font-bold [&_input]:!text-[1rem] [&_label]:font-bold [&_label]:!text-[1rem]'
              disabled
            />
          </div>
          <div className='flex w-full md:!w-[30%]'>
            <InputNumberValid
              handleForm={handleForm}
              label='Total neto'
              name={`${FINANCE_CODE}total_neto`}
              min={0}
              mode={InputNumberMode.CURRENCY}
              currency='COP'
              locale='es-CO'
              useGrouping={true}
              className='w-full [&_input]:text-right [&_input]:font-bold [&_input]:!text-[1rem] [&_label]:font-bold [&_label]:!text-[1rem]'
              disabled
            />
          </div>
        </div>
        <InputTextareaValid
          handleForm={handleForm}
          label='Observaciones'
          name={`${FINANCE_CODE}observaciones`}
          rows={4}
          gridRows={4}
          pattern={regexPatterns.onlyEmpty}
        />
        <div className='flex flex-col md:flex-row gap-2 justify-center'>
          <Button
            type='button'
            label='Cancelar'
            icon='pi pi-times'
            severity='danger'
            className='w-full md:w-fit'
            onClick={() =>
              clientInfo &&
              goToPage(parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }))
            }
          />
          <Button
            type='submit'
            label='Pagar'
            icon='pi pi-dollar'
            severity='success'
            className='w-full md:w-fit'
            loading={loading}
          />
        </div>
      </form>
    </Card>
  )
}

export default withToast(ClientFinance)
