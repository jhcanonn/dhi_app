'use client'

import {
  ListGroupType,
  handleAcceptedChange,
} from '@components/organisms/patient/BudgetItems'
import {
  DropdownOption,
  FieldsCodeBudgetItems,
  InvoiceForm,
  InvoiceItemsDirectus,
  InvoiceItemsTaxesDirectus,
} from '@models'
import {
  getCurrencyCOP,
  getItemKeys,
  getNumberOrUUID,
  invoicePriceListMapper,
  invoiceTaxListMapper,
} from '@utils'
import {
  DropdownValid,
  InputNumberValid,
  InputSwitchValid,
} from '@components/atoms'
import {
  calcBudgetValues,
  calcInvoiceValues,
  defaultPriceList,
  defaultTaxList,
} from './dataCalc'
import { UUID } from 'crypto'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { DropdownChangeEvent } from 'primereact/dropdown'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api'

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

type BudgetItemsTrProps = {
  handleForm: UseFormReturn<any, any, undefined>
  fieldsStartCode: string
  list?: any[]
  listGrouped?: ListGroupType[]
  disabledData?: boolean
  invoiceForm?: boolean
  initialData?: InvoiceForm
  tag: string
  rowIds: (UUID | number)[]
  rowId: UUID | number
  onListChange?: (value: any, tag: string, rowId: UUID | number) => void
  setRowIds: Dispatch<
    SetStateAction<
      (number | `${string}-${string}-${string}-${string}-${string}`)[]
    >
  >
  setRowAdded: Dispatch<SetStateAction<boolean>>
}

const BudgetItemsTr = ({
  handleForm,
  fieldsStartCode,
  list,
  listGrouped,
  disabledData,
  invoiceForm,
  initialData,
  tag,
  rowId,
  rowIds,
  onListChange,
  setRowIds,
  setRowAdded,
}: BudgetItemsTrProps) => {
  const [invoicePriceList, setInvoicePriceList] = useState<DropdownOption[]>([])
  const [invoiceTaxList, setInvoiceTaxList] = useState<DropdownOption[]>([])

  const { setValue, getValues, unregister } = handleForm
  const isFirtsRow = rowIds.indexOf(rowId) === 0

  const handleInputChange = (rowId: UUID | number) => {
    invoiceForm
      ? calcInvoiceValues(handleForm, fieldsStartCode, tag, rowId)
      : calcBudgetValues(handleForm, fieldsStartCode, tag, rowId)
  }

  const valueChangeByIncludedTax = () => {
    const itemInfo = getValues(`${tag}${FieldsCodeBudgetItems.L}${rowId}`)
    if (itemInfo) {
      const item: InvoiceItemsDirectus = JSON.parse(itemInfo)
      if (item.tax_included) {
        const taxInfo = JSON.parse(
          getValues(`${tag}${FieldsCodeBudgetItems.I}${rowId}`),
        ) as InvoiceItemsTaxesDirectus
        if (taxInfo.percentage >= 0) {
          const basePriceList = item.prices[0].price_list
          const newPriceList = basePriceList.map((pl) => {
            const newPrice = pl.value / (1 + taxInfo.percentage / 100)
            const newPriceInfo = { ...basePriceList, value: newPrice }
            return {
              name: getCurrencyCOP(newPrice),
              value: JSON.stringify(newPriceInfo),
            } as DropdownOption
          })
          setInvoicePriceList(newPriceList)
        }
      }
    }
  }

  useEffect(() => {
    if (invoiceForm && !initialData) {
      setInvoicePriceList(defaultPriceList)
      setInvoiceTaxList(defaultTaxList)
    }
  }, [])

  useEffect(() => {
    if (invoicePriceList?.length > 0) {
      setValue(
        `${tag}${FieldsCodeBudgetItems.VU}${rowId}`,
        invoicePriceList[0].value,
      )
      handleInputChange(rowId)
    }
  }, [invoicePriceList])

  useEffect(() => {
    if (invoiceTaxList?.length > 0) {
      setValue(
        `${tag}${FieldsCodeBudgetItems.I}${rowId}`,
        invoiceTaxList[0].value,
      )
      valueChangeByIncludedTax()
      handleInputChange(rowId)
    }
  }, [invoiceTaxList])

  const setSelectedPrice = (
    item: InvoiceItemsDirectus,
    initialData: InvoiceForm,
  ) => {
    const precioKey = `${tag}${FieldsCodeBudgetItems.VU}${rowId}`
    const selectedPrice = item.prices
      ?.find((price) => price.currency_code === 'COP')
      ?.price_list?.find((pl) => pl.value === +initialData[precioKey])
    selectedPrice && setValue(precioKey, JSON.stringify(selectedPrice || ''))
  }

  const setSelectedTax = (
    item: InvoiceItemsDirectus,
    initialData: InvoiceForm,
  ) => {
    const impuestoKey = `${tag}${FieldsCodeBudgetItems.I}${rowId}`
    const selectedTax = JSON.stringify(
      item.taxes?.find((t) => t.id === +initialData[impuestoKey]),
    )
    selectedTax && setValue(impuestoKey, selectedTax)
  }

  useEffect(() => {
    if (initialData && list && list.length > 0) {
      const itemCode: string = getValues(
        `${tag}${FieldsCodeBudgetItems.L}${rowId}`,
      )
      const selectedItem = JSON.parse(
        itemCode.charAt(0) === '{'
          ? itemCode
          : list.find((item) => item.code === itemCode)?.value,
      ) as InvoiceItemsDirectus

      setInvoicePriceList(
        invoicePriceListMapper(selectedItem) || defaultPriceList,
      )
      setSelectedPrice(selectedItem, initialData)
      setInvoiceTaxList(invoiceTaxListMapper(selectedItem) || defaultTaxList)
      setSelectedTax(selectedItem, initialData)
    }
  }, [list])

  return (
    <tr>
      <td className={cx('max-w-[4.5rem]', { 'pt-2': isFirtsRow })}>
        <DropdownValid
          handleForm={handleForm}
          name={`${tag}${FieldsCodeBudgetItems.L}${rowId}`}
          list={(listGrouped ?? list) || []}
          groupedItemTemplate={
            listGrouped
              ? (option: ListGroupType) => groupedItemTemplate(option)
              : undefined
          }
          onCustomChange={(e: DropdownChangeEvent) => {
            const value = JSON.parse(e.value)
            onListChange && onListChange(value, tag, rowId)
            const cantCode = `${tag}${FieldsCodeBudgetItems.C}${rowId}`
            if (getValues(cantCode) === 0 || getValues(cantCode) === null)
              setValue(cantCode, 1, { shouldValidate: true })
            if (invoiceForm) {
              setInvoicePriceList(
                invoicePriceListMapper(value) || defaultPriceList,
              )
              setInvoiceTaxList(invoiceTaxListMapper(value) || defaultTaxList)
            } else {
              handleInputChange(rowId)
            }
          }}
          required
          disabled={disabledData}
        />
      </td>
      <td className={cx('w-[4.5rem]', { 'pt-2': isFirtsRow })}>
        <InputNumberValid
          handleForm={handleForm}
          name={`${tag}${FieldsCodeBudgetItems.C}${rowId}`}
          min={0}
          shortErrorMessage
          onCustomChange={() => handleInputChange(rowId)}
          required
          className='[&_input]:text-right'
          disabled={disabledData}
        />
      </td>
      {invoiceForm ? (
        <td className={cx({ 'pt-2': isFirtsRow })}>
          <DropdownValid
            handleForm={handleForm}
            name={`${tag}${FieldsCodeBudgetItems.VU}${rowId}`}
            list={invoicePriceList}
            onCustomChange={() => handleInputChange(rowId)}
            className='[&_span.p-inputtext]:text-right'
            required
            disabled={disabledData}
          />
        </td>
      ) : (
        <td className={cx({ 'pt-2': isFirtsRow })}>
          <InputNumberValid
            handleForm={handleForm}
            name={`${tag}${FieldsCodeBudgetItems.V}${rowId}`}
            min={0}
            mode={InputNumberMode.CURRENCY}
            currency='COP'
            locale='es-CO'
            useGrouping={true}
            className='[&_input]:text-right'
            disabled
          />
        </td>
      )}
      <td className={cx('w-[4.5rem]', { 'pt-2': isFirtsRow })}>
        <InputNumberValid
          handleForm={handleForm}
          name={`${tag}${FieldsCodeBudgetItems.D}${rowId}`}
          min={0}
          max={100}
          suffix='%'
          shortErrorMessage
          onCustomChange={() => handleInputChange(rowId)}
          required
          className='[&_input]:text-right'
          disabled={disabledData}
        />
      </td>
      {!invoiceForm && (
        <td className={cx({ 'pt-2': isFirtsRow })}>
          <InputNumberValid
            handleForm={handleForm}
            name={`${tag}${FieldsCodeBudgetItems.VCD}${rowId}`}
            min={0}
            mode={InputNumberMode.CURRENCY}
            currency='COP'
            locale='es-CO'
            useGrouping={true}
            className='[&_input]:text-right'
            disabled
          />
        </td>
      )}
      {invoiceForm && (
        <td className={cx({ 'pt-2': isFirtsRow })}>
          <DropdownValid
            handleForm={handleForm}
            name={`${tag}${FieldsCodeBudgetItems.I}${rowId}`}
            list={invoiceTaxList}
            onCustomChange={() => {
              valueChangeByIncludedTax()
              handleInputChange(rowId)
            }}
            className='[&_span.p-inputtext]:text-right'
            required
            disabled={disabledData}
          />
        </td>
      )}
      <td className={cx({ 'pt-2': isFirtsRow })}>
        <InputNumberValid
          handleForm={handleForm}
          name={`${tag}${FieldsCodeBudgetItems.VT}${rowId}`}
          min={0}
          mode={InputNumberMode.CURRENCY}
          currency='COP'
          locale='es-CO'
          useGrouping={true}
          className='[&_input]:text-right'
          disabled
        />
      </td>
      {!invoiceForm && (
        <td className={cx({ 'pt-2': isFirtsRow })}>
          <InputSwitchValid
            name={`${tag}${FieldsCodeBudgetItems.A}${rowId}`}
            handleForm={handleForm}
            className='[&>div]:justify-center'
            onCustomChange={() =>
              handleAcceptedChange(handleForm, fieldsStartCode)
            }
            disabled={disabledData}
          />
        </td>
      )}
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
              getItemKeys(getValues(), `${tag}_`)
                .filter((key) => getNumberOrUUID(key) === rowId)
                .forEach((key) => unregister(key))
              invoiceForm
                ? handleInputChange(rowId)
                : handleAcceptedChange(handleForm, fieldsStartCode)
            }}
            outlined
          />
          <div className='h-[20px]'></div>
        </td>
      )}
    </tr>
  )
}

export default BudgetItemsTr
