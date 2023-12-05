'use client'

import {
  BudgetItem,
  BudgetPanelCodes,
  BudgetState,
  DropdownOption,
  FieldsCodeBudgetItems,
  InvoiceForm,
  InvoiceItemType,
} from '@models'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { BudgetItemsTr } from '@components/molecules'
import { FINANCE_CODE, budgetFormCodes, getItemKeys, getRowIds } from '@utils'
import { classNames as cx } from 'primereact/utils'

export type ListGroupType = {
  label: string
  color: string
  items: any[]
}

export const getBudgetTotalOnlyAccepted = (formData: any) =>
  Object.entries(formData)
    .filter(([key]) => key.includes(FieldsCodeBudgetItems.A))
    .reduce((acc, [key, accepted]) => {
      const rowId = key.split('_').slice(-1)[0] as UUID
      const vtCode = Object.keys(formData).find((key) =>
        key.endsWith(`${FieldsCodeBudgetItems.VT}${rowId}`),
      )
      const valorTotal = Number(vtCode ? formData[vtCode] : 0)
      return acc + (accepted ? valorTotal : 0)
    }, 0)

export const getBudgetTotal = (formData: any) =>
  Object.entries(formData)
    .filter(([key]) => key.includes(FieldsCodeBudgetItems.VT))
    .reduce((acc, [, value]) => acc + (value ? Number(value) : 0), 0)

export const handleAcceptedChange = (
  handleForm: UseFormReturn<any, any, undefined>,
  fieldsStartCode: string,
) => {
  const { setValue, getValues } = handleForm

  const acceptedCodes = Object.entries(getValues()).filter(([key]) =>
    key.includes(FieldsCodeBudgetItems.A),
  )
  const total = acceptedCodes.reduce((acc, [, value]) => {
    const accept = value ? 1 : 0
    return acc + accept
  }, 0)

  const initCode =
    budgetFormCodes[
      getValues(`${fieldsStartCode}planilla`) as keyof typeof budgetFormCodes
    ]
  setValue(
    `${initCode}${BudgetPanelCodes.STATE}`,
    total === 0
      ? BudgetState.NO_ACEPTADO
      : total === acceptedCodes.length
        ? BudgetState.ACEPTADO
        : BudgetState.ACEPTADO_PARCIAL,
  )
  setValue(`${fieldsStartCode}total`, getBudgetTotal(getValues()))
}

type BudgetItemsProps = {
  handleForm: UseFormReturn<any, any, undefined>
  fieldsStartCode: string
  legend: string
  buttonLabel: string
  list?: any[]
  listGrouped?: ListGroupType[]
  disabledData?: boolean
  invoiceForm?: boolean
  initialData?: InvoiceForm
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
}

const BudgetItems = ({
  handleForm,
  fieldsStartCode,
  legend,
  buttonLabel,
  list,
  listGrouped,
  disabledData,
  invoiceForm,
  initialData,
  onListChange,
}: BudgetItemsProps) => {
  const [rowIds, setRowIds] = useState<(UUID | number)[]>([])
  const [rowAdded, setRowAdded] = useState<boolean>(false)

  const { setValue, getValues, unregister } = handleForm

  const tag = `${fieldsStartCode}${legend.trim().toLowerCase()}`

  const setInvoiceItems = (
    initialData: InvoiceForm,
    items: (DropdownOption & { code: string })[] = [],
    itemTag: BudgetItem,
  ) => {
    const initItemsCode = `${FINANCE_CODE}${itemTag.toLocaleLowerCase()}`
    getRowIds(initialData, `${initItemsCode}_`).forEach((rowId) => {
      const itemKey = `${initItemsCode}${FieldsCodeBudgetItems.L}${rowId}`
      const itemCode = initialData[itemKey] as string
      const selectedItem = items.find((item) => item.code === itemCode)?.value
      selectedItem && setValue(itemKey, selectedItem)
    })
  }

  useEffect(() => {
    if (initialData && list && list.length > 0) {
      const itemType = JSON.parse(list[0].value).type
      setInvoiceItems(
        initialData,
        list,
        itemType === InvoiceItemType.PRODUCT
          ? BudgetItem.PRODUCTS
          : BudgetItem.SERVICES,
      )
    }
  }, [list])

  useEffect(() => {
    if (rowAdded && rowIds.length > 0) {
      const id = rowIds[rowIds.length - 1]
      Object.values(FieldsCodeBudgetItems).forEach((code) => {
        let skip = false
        if (invoiceForm) {
          skip = [FieldsCodeBudgetItems.V, FieldsCodeBudgetItems.A].includes(
            code,
          )
        } else {
          skip = [
            FieldsCodeBudgetItems.VU,
            FieldsCodeBudgetItems.I,
            FieldsCodeBudgetItems.VI,
            FieldsCodeBudgetItems.VD,
          ].includes(code)
        }
        !skip && setValue(`${tag}${code}${id}`, 0)
      })
      setValue(`${tag}${FieldsCodeBudgetItems.L}${id}`, undefined)
      !invoiceForm && handleAcceptedChange(handleForm, fieldsStartCode)
    }
  }, [rowIds])

  useEffect(() => {
    setRowIds(getRowIds(getValues(), `${tag}_`))
    return () => {
      getItemKeys(getValues(), `${tag}_`).forEach((key) => unregister(key))
      !invoiceForm &&
        setValue(`${fieldsStartCode}total`, getBudgetTotal(getValues()))
    }
  }, [])

  return (
    <Fieldset legend={legend} className='relative min-w-0'>
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
          <table role='table' className='foliculos-table text-sm min-w-[40rem]'>
            <thead>
              <tr>
                <th className='h-[2.3rem] min-w-[15rem] rounded-l-md'>
                  {legend}
                </th>
                <th className='min-w-[4.5rem]'>Cant.</th>
                {invoiceForm ? (
                  <th className='min-w-[12rem]'>Valor unitario</th>
                ) : (
                  <th className='min-w-[10rem]'>Valor</th>
                )}
                <th className='min-w-[4.5rem]'>% Dcto.</th>
                {!invoiceForm && (
                  <th className='min-w-[10rem]'>Valor con descuento</th>
                )}
                {invoiceForm && <th className='min-w-[12rem]'>Impuestos</th>}
                <th
                  className={cx('min-w-[10rem]', {
                    'rounded-r-md': invoiceForm && initialData,
                  })}
                >
                  Valor total
                </th>
                {!invoiceForm && (
                  <th
                    className={cx('min-w-[4.5rem]', {
                      'rounded-r-md': disabledData,
                    })}
                  >
                    Aceptado
                  </th>
                )}
                {!disabledData && <th className='rounded-r-md'></th>}
              </tr>
            </thead>
            <tbody>
              {rowIds.map((rowId) => (
                <BudgetItemsTr
                  key={`${tag}_${rowId}`}
                  handleForm={handleForm}
                  fieldsStartCode={fieldsStartCode}
                  rowIds={rowIds}
                  rowId={rowId}
                  tag={tag}
                  list={list}
                  listGrouped={listGrouped}
                  disabledData={!!initialData || disabledData}
                  invoiceForm={invoiceForm}
                  initialData={initialData}
                  setRowIds={setRowIds}
                  setRowAdded={setRowAdded}
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

export default BudgetItems
