'use client'

import {
  FINANCE_CODE,
  PAYMENT_WAY_CODE,
  getItemKeys,
  getNumberOrUUID,
} from '@utils'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { ReactNode, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { FieldsPaymentWayItems } from '@models'
import { DropdownValid, InputNumberValid } from '@components/atoms'
import { classNames as cx } from 'primereact/utils'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { PrimeIcons } from 'primereact/api'
import { withToast } from '@hooks'
import { getInvoiceTotal } from '@components/molecules/patient/dataCalc'

const sumPreviousPaymentWays = (data: Record<string, any>, rowId: string) =>
  Object.entries(data)
    .filter(
      ([key]) =>
        key.includes(`${PAYMENT_WAY_CODE}${FieldsPaymentWayItems.V}`) &&
        !key.endsWith(rowId + ''),
    )
    .reduce((acc, [, value]) => acc + (value ? Number(value) : 0), 0)

type PaymentWayItemsProps = {
  handleForm: UseFormReturn<any, any, undefined>
  legend: string
  buttonLabel: string
  list?: any[]
  disabledData?: boolean
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
  showWarning: (summary: ReactNode, detail: ReactNode) => void
}

const getLastRowId = (rowIds: (UUID | number)[]) => rowIds[rowIds.length - 1]

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
      'Información',
      'Total formas de pago y Total neto deben coincidir',
    )
  }
  if (totalNeto === 0) {
    valid = false
    showWarning('Información', 'Total Neto debe ser mayor a $0,00')
  }
  if (totalNeto !== 0 && !isPayButton && totalFDP === totalNeto) {
    valid = false
    showWarning('Información', 'Ya alcanzo el valor de Total Neto')
  }

  return valid
}

const PaymentWayItems = ({
  handleForm,
  legend,
  buttonLabel,
  list,
  disabledData,
  onListChange,
  showWarning,
}: PaymentWayItemsProps) => {
  const [rowIds, setRowIds] = useState<(UUID | number)[]>([])
  const [rowAdded, setRowAdded] = useState<boolean>(false)
  const [restPayment, setRestPayment] = useState<number>(0)

  const { setValue, getValues, unregister, trigger } = handleForm

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
      setValue(totalFDPCode, getInvoiceTotal(getValues(), valueFDPCodes))
    }
  }, [restPayment])

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
                getInvoiceTotal(getValues(), valueFDPCodes),
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
                <th className='min-w-[10rem]'>Valor</th>
                {!disabledData && <th className='rounded-r-md'></th>}
              </tr>
            </thead>
            <tbody>
              {rowIds.map((rowId) => {
                const isFirtsRow = rowIds.indexOf(rowId) === 0
                const valueCode = `${tag}${FieldsPaymentWayItems.V}${rowId}`
                return (
                  <tr key={`${tag}_${rowId}`}>
                    <td
                      className={cx('max-w-[4.5rem]', { 'pt-2': isFirtsRow })}
                    >
                      <DropdownValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsPaymentWayItems.L}${rowId}`}
                        list={list || []}
                        onCustomChange={(e: DropdownChangeEvent) => {
                          const value = JSON.parse(e.value)
                          onListChange && onListChange(value, tag, rowId)
                        }}
                        required
                        disabled={disabledData}
                      />
                    </td>
                    <td className={cx({ 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={valueCode}
                        min={0}
                        mode={InputNumberMode.CURRENCY}
                        currency='COP'
                        locale='es-CO'
                        useGrouping={true}
                        className='[&_input]:text-right'
                        required
                        validate={(value) => value !== 0}
                        onCustomChange={() => {
                          trigger(valueCode)
                          setValue(
                            totalFDPCode,
                            getInvoiceTotal(getValues(), valueFDPCodes),
                          )
                        }}
                        disabled={
                          disabledData || getLastRowId(rowIds) !== rowId
                        }
                      />
                    </td>
                    {!disabledData && (
                      <td
                        className={cx('flex flex-col items-center', {
                          'pt-2': isFirtsRow,
                        })}
                      >
                        <Button
                          type='button'
                          icon={PrimeIcons.TRASH}
                          severity='danger'
                          tooltip='Eliminar item'
                          tooltipOptions={{ position: 'bottom' }}
                          onClick={() => {
                            setRowIds((prev) =>
                              prev.filter((id) => id !== rowId),
                            )
                            setRowAdded(false)
                            getItemKeys(getValues(), `${tag}_`)
                              .filter((key) => getNumberOrUUID(key) === rowId)
                              .forEach((key) => unregister(key))
                            setValue(
                              totalFDPCode,
                              getInvoiceTotal(getValues(), valueFDPCodes),
                            )
                          }}
                          outlined
                        />
                        <div className='h-[20px]'></div>
                      </td>
                    )}
                  </tr>
                )
              })}
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
