import {
  FieldsCodeBudgetItems,
  InvoiceItemsTaxesDirectus,
  InvoicePriceDirectus,
} from '@models'
import { getBudgetTotal } from '@components/organisms/patient/BudgetItems'
import { getCurrencyCOP } from '@utils'
import { UUID } from 'crypto'
import { UseFormReturn } from 'react-hook-form'

export const defaultPriceList = [
  {
    name: getCurrencyCOP(0),
    value: JSON.stringify({
      position: 0,
      name: 'No definido',
      value: 0,
    } as InvoicePriceDirectus),
  },
]

export const defaultTaxList = [
  {
    name: 'Ninguno 0%',
    value: JSON.stringify({
      id: 0,
      name: 'Ninguno 0%',
      type: 'IVA',
      percentage: 0,
    } as InvoiceItemsTaxesDirectus),
  },
]

export const getInvoiceTotalValorUnitario = (formData: any) =>
  Object.entries(formData)
    .filter(([key]) => key.includes(FieldsCodeBudgetItems.VU))
    .reduce((acc, [, value]) => {
      const valueInfo: InvoicePriceDirectus = JSON.parse(value as any)
      return acc + (valueInfo.value ? Number(valueInfo.value) : 0)
    }, 0)

export const getInvoiceTotal = (formData: any, code: FieldsCodeBudgetItems) =>
  Object.entries(formData)
    .filter(([key]) => key.includes(code))
    .reduce((acc, [, value]) => acc + (value ? Number(value) : 0), 0)

export const calcInvoiceValues = (
  handleForm: UseFormReturn<any, any, undefined>,
  fieldsStartCode: string,
  tag: string,
  rowId: UUID | number,
) => {
  const { setValue, getValues } = handleForm
  const cantidad = getValues(`${tag}${FieldsCodeBudgetItems.C}${rowId}`)
  const dcto = getValues(`${tag}${FieldsCodeBudgetItems.D}${rowId}`)
  const valorConDctoCode = `${tag}${FieldsCodeBudgetItems.VCD}${rowId}`
  const valorTotalCode = `${tag}${FieldsCodeBudgetItems.VT}${rowId}`
  const valorImpuestoCode = `${tag}${FieldsCodeBudgetItems.VI}${rowId}`

  const taxInfo = JSON.parse(
    getValues(`${tag}${FieldsCodeBudgetItems.I}${rowId}`),
  ) as InvoiceItemsTaxesDirectus
  const priceInfo = JSON.parse(
    getValues(`${tag}${FieldsCodeBudgetItems.VU}${rowId}`),
  ) as InvoicePriceDirectus
  setValue(
    `${tag}${FieldsCodeBudgetItems.VD}${rowId}`,
    priceInfo.value * (dcto / 100),
  )
  setValue(valorConDctoCode, priceInfo.value * (1 - dcto / 100))
  setValue(
    valorImpuestoCode,
    getValues(valorConDctoCode) * (taxInfo.percentage / 100),
  )
  setValue(
    valorTotalCode,
    cantidad > 0
      ? cantidad * getValues(valorConDctoCode) + getValues(valorImpuestoCode)
      : 0,
  )
  setValue(
    `${fieldsStartCode}total_bruto`,
    getInvoiceTotalValorUnitario(getValues()),
  )
  setValue(
    `${fieldsStartCode}descuentos`,
    getInvoiceTotal(getValues(), FieldsCodeBudgetItems.VD),
  )
  setValue(
    `${fieldsStartCode}subtotal`,
    getInvoiceTotal(getValues(), FieldsCodeBudgetItems.VCD),
  )
  setValue(
    `${fieldsStartCode}iva`,
    getInvoiceTotal(getValues(), FieldsCodeBudgetItems.VI),
  )
  setValue(
    `${fieldsStartCode}total_neto`,
    getInvoiceTotal(getValues(), FieldsCodeBudgetItems.VT),
  )
}

export const calcBudgetValues = (
  handleForm: UseFormReturn<any, any, undefined>,
  fieldsStartCode: string,
  tag: string,
  rowId: UUID | number,
) => {
  const { setValue, getValues } = handleForm
  const cantidad = getValues(`${tag}${FieldsCodeBudgetItems.C}${rowId}`)
  const value = getValues(`${tag}${FieldsCodeBudgetItems.V}${rowId}`)
  const dcto = getValues(`${tag}${FieldsCodeBudgetItems.D}${rowId}`)
  const valorConDctoCode = `${tag}${FieldsCodeBudgetItems.VCD}${rowId}`

  setValue(valorConDctoCode, value * (1 - dcto / 100))
  setValue(
    `${tag}${FieldsCodeBudgetItems.VT}${rowId}`,
    cantidad * getValues(valorConDctoCode),
  )
  setValue(`${fieldsStartCode}total`, getBudgetTotal(getValues()))
}
