'use client'

import { DropdownValid, InputNumberValid } from '@components/atoms'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { FieldsCodeBudgetItems } from '@models'
import { BUDGET_CODE } from '@utils'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { Fieldset } from 'primereact/fieldset'
import { classNames as cx } from 'primereact/utils'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

export type ListGroupType = {
  label: string
  color: string
  items: any[]
}

type BudgetItemsProps = {
  handleForm: UseFormReturn<any, any, undefined>
  legend: string
  buttonLabel: string
  list?: any[]
  listGrouped?: ListGroupType[]
  onListChange: (value: any, tag: string, rowId: UUID) => void
}

export const getBudgetTotal = (formData: any) =>
  Object.entries(formData)
    .filter(([key]) => key.includes(FieldsCodeBudgetItems.VT))
    .reduce((acc, [, value]) => acc + Number(value), 0)

const groupedItemTemplate = (option: ListGroupType) => {
  return (
    <div className='flex gap-2 align-items-center'>
      <div
        className='rounded-md !w-4 !h-4'
        style={{ backgroundColor: option.color }}
      ></div>
      <p className='text-[1rem]'>{option.label}</p>
    </div>
  )
}

const BudgetItems = ({
  handleForm,
  legend,
  buttonLabel,
  list,
  listGrouped,
  onListChange,
}: BudgetItemsProps) => {
  const [rowIds, setRowIds] = useState<UUID[]>([])
  const [rowAdded, setRowAdded] = useState<boolean>(false)

  const { setValue, getValues, unregister } = handleForm

  const tag = `${BUDGET_CODE}${legend.trim().toLowerCase()}`

  const handleInputChange = (rowId: UUID) => {
    const valorDctoCode = `${tag}${FieldsCodeBudgetItems.VD}${rowId}`
    const value = getValues(`${tag}${FieldsCodeBudgetItems.V}${rowId}`)
    const dcto = getValues(`${tag}${FieldsCodeBudgetItems.D}${rowId}`)
    const catidad = getValues(`${tag}${FieldsCodeBudgetItems.C}${rowId}`)
    setValue(valorDctoCode, value * (1 - dcto / 100))
    setValue(
      `${tag}${FieldsCodeBudgetItems.VT}${rowId}`,
      catidad * getValues(valorDctoCode),
    )
    setValue(`${BUDGET_CODE}total`, getBudgetTotal(getValues()))
  }

  useEffect(() => {
    if (rowAdded && rowIds.length > 0) {
      const id = rowIds[rowIds.length - 1]
      Object.values(FieldsCodeBudgetItems).forEach((code) =>
        setValue(`${tag}${code}${id}`, 0),
      )
      setValue(`${tag}${FieldsCodeBudgetItems.L}${id}`, undefined)
    }
  }, [rowIds])

  useEffect(() => {
    return () => {
      Object.keys(getValues())
        .filter((key) => key.startsWith(`${tag}_`))
        .forEach((key) => unregister(key))
      setValue(`${BUDGET_CODE}total`, getBudgetTotal(getValues()))
    }
  }, [])

  return (
    <Fieldset legend={legend} className='relative min-w-0'>
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
      {rowIds.length > 0 ? (
        <div className='overflow-auto'>
          <table role='table' className='foliculos-table text-sm min-w-[40rem]'>
            <thead>
              <tr>
                <th className='h-[2.3rem] min-w-[15rem] rounded-l-md'>
                  {legend}
                </th>
                <th className='min-w-[4.5rem]'>Cant.</th>
                <th className='min-w-[10rem]'>Valor</th>
                <th className='min-w-[4.5rem]'>% Dcto.</th>
                <th className='min-w-[10rem]'>Valor con descuento</th>
                <th className='min-w-[10rem]'>Valor total</th>
                <th className='rounded-r-md'></th>
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
                        name={`${tag}${FieldsCodeBudgetItems.L}${rowId}`}
                        list={(listGrouped ?? list) || []}
                        groupedItemTemplate={
                          listGrouped
                            ? (option: ListGroupType) =>
                                groupedItemTemplate(option)
                            : undefined
                        }
                        required
                        onCustomChange={(e: DropdownChangeEvent) =>
                          onListChange(JSON.parse(e.value), tag, rowId)
                        }
                      />
                    </td>
                    <td className={cx('w-[4.5rem]', { 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsCodeBudgetItems.C}${rowId}`}
                        min={0}
                        required
                        shortErrorMessage
                        onCustomChange={() => handleInputChange(rowId)}
                      />
                    </td>
                    <td className={cx({ 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsCodeBudgetItems.V}${rowId}`}
                        min={0}
                        disabled
                        mode={InputNumberMode.CURRENCY}
                        currency='COP'
                        locale='es-CO'
                        useGrouping={true}
                      />
                    </td>
                    <td className={cx('w-[4.5rem]', { 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsCodeBudgetItems.D}${rowId}`}
                        min={0}
                        max={100}
                        suffix='%'
                        required
                        shortErrorMessage
                        onCustomChange={() => handleInputChange(rowId)}
                      />
                    </td>
                    <td className={cx({ 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsCodeBudgetItems.VD}${rowId}`}
                        min={0}
                        disabled
                        mode={InputNumberMode.CURRENCY}
                        currency='COP'
                        locale='es-CO'
                        useGrouping={true}
                      />
                    </td>
                    <td className={cx({ 'pt-2': isFirtsRow })}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={`${tag}${FieldsCodeBudgetItems.VT}${rowId}`}
                        min={0}
                        disabled
                        mode={InputNumberMode.CURRENCY}
                        currency='COP'
                        locale='es-CO'
                        useGrouping={true}
                      />
                    </td>
                    <td
                      className={cx('flex flex-col items-center', {
                        'pt-2': isFirtsRow,
                      })}
                    >
                      <Button
                        type='button'
                        icon='pi pi-trash'
                        severity='danger'
                        tooltip='Eliminar item'
                        tooltipOptions={{ position: 'bottom' }}
                        onClick={() => {
                          setRowIds((prev) => prev.filter((id) => id !== rowId))
                          setRowAdded(false)
                          Object.keys(getValues())
                            .filter((key) => key.includes(rowId))
                            .forEach((key) => unregister(key))
                          setValue(
                            `${BUDGET_CODE}total`,
                            getBudgetTotal(getValues()),
                          )
                        }}
                        outlined
                      />
                      <div className='h-[20px]'></div>
                    </td>
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

export default BudgetItems
