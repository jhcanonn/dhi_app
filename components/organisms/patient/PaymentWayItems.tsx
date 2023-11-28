'use client'

import {
  FINANCE_CODE,
  PAYMENT_WAY_CODE,
  getItemKeys,
  getNumberOrUUID,
  getRowIds,
} from '@utils'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { FieldsPaymentWayItems } from '@models'
import { DropdownValid, InputNumberValid } from '@components/atoms'
import { classNames as cx } from 'primereact/utils'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { PrimeIcons } from 'primereact/api'

type PaymentWayItemsProps = {
  handleForm: UseFormReturn<any, any, undefined>
  legend: string
  buttonLabel: string
  list?: any[]
  disabledData?: boolean
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
}

const PaymentWayItems = ({
  handleForm,
  legend,
  buttonLabel,
  list,
  disabledData,
  onListChange,
}: PaymentWayItemsProps) => {
  const [rowIds, setRowIds] = useState<(UUID | number)[]>([])
  const [rowAdded, setRowAdded] = useState<boolean>(false)

  const { setValue, getValues, unregister } = handleForm

  const tag = `${FINANCE_CODE}${PAYMENT_WAY_CODE}`

  useEffect(() => {
    if (rowAdded && rowIds.length > 0) {
      const id = rowIds[rowIds.length - 1]
      setValue(`${tag}${FieldsPaymentWayItems.L}${id}`, undefined)
      setValue(`${tag}${FieldsPaymentWayItems.V}${id}`, 0)
    }
  }, [rowIds])

  useEffect(() => {
    setRowIds(getRowIds(getValues(), `${tag}_`))
    return () => {
      getItemKeys(getValues(), `${tag}_`).forEach((key) => unregister(key))
      // setValue(`${PAYMENT_WAY_CODE}total`, getBudgetTotal(getValues()))
    }
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
          onClick={() => {
            const uuid = uuidv4() as UUID
            setRowIds((prev) => [...prev, uuid])
            setRowAdded(true)
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
                          console.log({ value })
                          onListChange && onListChange(value, tag, rowId)
                        }}
                        required
                        disabled={disabledData}
                      />
                    </td>
                    <td className={cx({ 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsPaymentWayItems.V}${rowId}`}
                        min={0}
                        mode={InputNumberMode.CURRENCY}
                        currency='COP'
                        locale='es-CO'
                        useGrouping={true}
                        className='[&_input]:text-right'
                        disabled
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

export default PaymentWayItems
