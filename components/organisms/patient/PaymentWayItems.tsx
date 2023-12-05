'use client'

import {
  DropdownOption,
  FieldsPaymentWayItems,
  InvoiceForm,
  InvoicePaymentWaysDirectus,
} from '@models'
import { FINANCE_CODE, PAYMENT_WAY_CODE, getRowIds } from '@utils'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { ReactNode, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { withToast } from '@hooks'
import { getInvoiceTotalNeto } from '@components/molecules/patient/dataCalc'
import PaymentWayTr from '@components/molecules/patient/PaymentWayTr'
import moment from 'moment'
import { classNames as cx } from 'primereact/utils'

const sumPreviousPaymentWays = (data: Record<string, any>, rowId: string) =>
  Object.entries(data)
    .filter(
      ([key]) =>
        key.includes(`${PAYMENT_WAY_CODE}${FieldsPaymentWayItems.V}`) &&
        !key.endsWith(rowId + ''),
    )
    .reduce((acc, [, value]) => acc + (value ? Number(value) : 0), 0)

export const getLastRowId = (rowIds: (UUID | number)[]) =>
  rowIds[rowIds.length - 1]

export const validTotals = (
  handleForm: UseFormReturn<any, any, undefined>,
  showWarning: (summary: ReactNode, detail: ReactNode) => void,
  isPayButton: boolean,
  valid: boolean = true,
) => {
  const { getValues } = handleForm
  const totalFDP = getValues(`${FINANCE_CODE}total_formas_de_pago`)
  const totalNeto = getValues(`${FINANCE_CODE}total_neto`)

  if (isPayButton ? totalFDP !== totalNeto : totalFDP > totalNeto) {
    valid = false
    showWarning(
      'Totales diferentes',
      'Total formas de pago y Total neto deben coincidir',
    )
  }
  if (totalNeto === 0) {
    valid = false
    showWarning(
      'Agregar Producto o Servicio',
      'Total Neto debe ser mayor a $0,00',
    )
  }
  if (totalNeto !== 0 && !isPayButton && totalFDP === totalNeto) {
    valid = false
    showWarning('Ya puede pagar', 'Ya alcanzo el valor de Total Neto')
  }

  return valid
}

type PaymentWayItemsProps = {
  handleForm: UseFormReturn<any, any, undefined>
  legend: string
  buttonLabel: string
  list?: any[]
  disabledData?: boolean
  initialData?: InvoiceForm
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
}

const PaymentWayItems = ({
  handleForm,
  legend,
  buttonLabel,
  list,
  disabledData,
  initialData,
  onListChange,
  showWarning,
}: PaymentWayItemsProps) => {
  const [rowIds, setRowIds] = useState<(UUID | number)[]>([])
  const [rowAdded, setRowAdded] = useState<boolean>(false)
  const [restPayment, setRestPayment] = useState<number>(0)

  const { setValue, getValues, trigger } = handleForm

  const tag = `${FINANCE_CODE}${PAYMENT_WAY_CODE}`
  const valueFDPCodes = `${PAYMENT_WAY_CODE}${FieldsPaymentWayItems.V}`
  const totalFDPCode = `${FINANCE_CODE}total_formas_de_pago`
  const totalNetoCode = `${FINANCE_CODE}total_neto`

  useEffect(() => {
    if (rowAdded && rowIds.length > 0) {
      const id = getLastRowId(rowIds)
      setValue(`${tag}${FieldsPaymentWayItems.L}${id}`, undefined)
      setValue(`${tag}${FieldsPaymentWayItems.V}${id}`, 0)
      const rest =
        getValues(totalNetoCode) - sumPreviousPaymentWays(getValues(), id + '')
      setRestPayment(rest)
    }
  }, [rowIds])

  useEffect(() => {
    if (restPayment > 0) {
      const id = getLastRowId(rowIds)
      setValue(`${tag}${FieldsPaymentWayItems.V}${id}`, restPayment)
      setValue(totalFDPCode, getInvoiceTotalNeto(getValues(), valueFDPCodes))
    }
  }, [restPayment])

  useEffect(() => {
    if (initialData && list && list.length > 0) {
      const initItemsCode = `${FINANCE_CODE}${PAYMENT_WAY_CODE}`
      getRowIds(initialData, `${initItemsCode}_`).forEach((rowId) => {
        const itemKey = `${initItemsCode}${FieldsPaymentWayItems.L}${rowId}`
        const selectedItem = list.find((fp: DropdownOption) => {
          const fpId: InvoicePaymentWaysDirectus = JSON.parse(fp.value)
          return +fpId.id === +initialData[itemKey]
        })?.value
        selectedItem && setValue(itemKey, selectedItem)
        const dueDateKey = `${initItemsCode}${FieldsPaymentWayItems.DD}${rowId}`
        const dueDate = initialData[dueDateKey]
        dueDate && setValue(dueDateKey, moment(dueDate).toDate())
      })
    }
  }, [list])

  useEffect(() => {
    setRowIds(getRowIds(getValues(), `${tag}_`))
  }, [])

  return (
    <Fieldset legend={legend} className='relative min-w-0 h-full'>
      {!disabledData && (
        <Button
          type='button'
          icon='pi pi-plus'
          label={buttonLabel}
          severity='success'
          size='small'
          onClick={async () => {
            let valid = true
            if (rowIds.length > 0) {
              const id = getLastRowId(rowIds)
              valid = await trigger(`${tag}${FieldsPaymentWayItems.V}${id}`)
            }
            valid = validTotals(handleForm, showWarning, false, valid)
            if (valid) {
              const uuid = uuidv4() as UUID
              setRowIds((prev) => [...prev, uuid])
              setRowAdded(true)
              setValue(
                totalFDPCode,
                getInvoiceTotalNeto(getValues(), valueFDPCodes),
              )
            }
          }}
          className='w-full mb-4 md:w-fit md:mb-0 md:absolute md:right-4 md:top-[-2.1rem] bg-white'
          outlined
        />
      )}
      {rowIds.length > 0 ? (
        <div className='overflow-auto'>
          <table role='table' className='foliculos-table text-sm min-w-[20rem]'>
            <thead>
              <tr>
                <th className='h-[2.3rem] min-w-[15rem] rounded-l-md'>
                  {legend}
                </th>
                <th className='min-w-[10rem]' />
                <th
                  className={cx('min-w-[10rem]', {
                    'rounded-r-md': disabledData,
                  })}
                >
                  Valor
                </th>
                {!disabledData && <th className='rounded-r-md'></th>}
              </tr>
            </thead>
            <tbody>
              {rowIds.map((rowId) => (
                <PaymentWayTr
                  key={`${tag}_${rowId}`}
                  handleForm={handleForm}
                  tag={tag}
                  rowId={rowId}
                  rowIds={rowIds}
                  setRowIds={setRowIds}
                  setRowAdded={setRowAdded}
                  list={list}
                  disabledData={disabledData}
                  initialData={initialData}
                  onListChange={onListChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className='text-center mb-2'>
          No existen {legend.trim().toLowerCase()}
        </p>
      )}
    </Fieldset>
  )
}

export default withToast(PaymentWayItems)
