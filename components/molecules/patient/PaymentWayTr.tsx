'use client'

import {
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
} from '@components/atoms'
import {
  FINANCE_CODE,
  PAYMENT_WAY_CODE,
  getItemKeys,
  getNumberOrUUID,
} from '@utils'
import { Dispatch, SetStateAction, useState } from 'react'
import { FieldsPaymentWayItems, InvoicePaymentWaysDirectus } from '@models'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { classNames as cx } from 'primereact/utils'
import { Button } from 'primereact/button'
import { UseFormReturn } from 'react-hook-form'
import { UUID } from 'crypto'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { PrimeIcons } from 'primereact/api'
import { getInvoiceTotal } from './dataCalc'
import { getLastRowId } from '@components/organisms/patient/PaymentWayItems'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  tag: string
  rowIds: (UUID | number)[]
  rowId: UUID | number
  setRowIds: Dispatch<
    SetStateAction<
      (number | `${string}-${string}-${string}-${string}-${string}`)[]
    >
  >
  setRowAdded: Dispatch<SetStateAction<boolean>>
  list?: any[]
  disabledData?: boolean
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
}

const PaymentWayTr = ({
  handleForm,
  tag,
  rowId,
  rowIds,
  setRowIds,
  setRowAdded,
  list,
  disabledData,
  onListChange,
}: Props) => {
  const [showDueDate, setShowDueDate] = useState<boolean>(false)

  const isFirtsRow = rowIds.indexOf(rowId) === 0
  const valueCode = `${tag}${FieldsPaymentWayItems.V}${rowId}`
  const totalFDPCode = `${FINANCE_CODE}total_formas_de_pago`
  const valueFDPCodes = `${PAYMENT_WAY_CODE}${FieldsPaymentWayItems.V}`

  const { setValue, getValues, unregister, trigger } = handleForm

  return (
    <tr key={`${tag}_${rowId}`}>
      <td className={cx('max-w-[4.5rem]', { 'pt-2': isFirtsRow })}>
        <DropdownValid
          handleForm={handleForm}
          name={`${tag}${FieldsPaymentWayItems.L}${rowId}`}
          list={list || []}
          onCustomChange={(e: DropdownChangeEvent) => {
            const paymentMethod = JSON.parse(
              e.value,
            ) as InvoicePaymentWaysDirectus
            setShowDueDate(paymentMethod.due_date)
            onListChange && onListChange(paymentMethod, tag, rowId)
          }}
          required
          disabled={disabledData}
        />
      </td>
      <td className={cx('max-w-[4.5rem]', { 'pt-2': isFirtsRow })}>
        {showDueDate && (
          <DateTimeValid
            name={`${FINANCE_CODE}created_date`}
            label='Fecha'
            handleForm={handleForm}
            showIcon={false}
            showTime={false}
            className='[&_input]:text-right'
          />
        )}
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
            setValue(totalFDPCode, getInvoiceTotal(getValues(), valueFDPCodes))
          }}
          disabled={disabledData || getLastRowId(rowIds) !== rowId}
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
              setRowIds((prev) => prev.filter((id) => id !== rowId))
              setRowAdded(false)
              setShowDueDate(false)
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
}

export default PaymentWayTr
