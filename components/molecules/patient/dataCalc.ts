import {
  FieldsCodeBudgetItems,
  InvoiceItemsTaxesDirectus,
  InvoicePriceDirectus,
} from '@models'
import { getBudgetTotal } from '@components/organisms/patient/BudgetItems'
import { getCurrencyCOP } from '@utils'
import { UUID } from 'crypto'
import { UseFormGetValues, UseFormReturn } from 'react-hook-form'

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

export const getInvoiceTotalValorUnitario = (
  getValues: UseFormGetValues<any>,
) =>
  Object.entries(getValues())
    .filter(([key]) => key.includes(FieldsCodeBudgetItems.VU))
    .reduce((acc, [key, value]) => {
      const cantidad = getValues(
        key.replace(FieldsCodeBudgetItems.VU, FieldsCodeBudgetItems.C),
      )
      const valueInfo: InvoicePriceDirectus = JSON.parse(value as any)
      return acc + (valueInfo.value ? cantidad * Number(valueInfo.value) : 0)
    }, 0)

export const getInvoiceTotal = (
  getValues: UseFormGetValues<any>,
  code: FieldsCodeBudgetItems,
) =>
  Object.entries(getValues())
    .filter(([key]) => key.includes(code))
    .reduce((acc, [key, value]) => {
      const cantidad = getValues(key.replace(code, FieldsCodeBudgetItems.C))
      return acc + (value ? cantidad * Number(value) : 0)
    }, 0)

export const getInvoiceTotalNeto = (
  formData: any,
  code: FieldsCodeBudgetItems | string,
) =>
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
  const impuesto = getValues(`${tag}${FieldsCodeBudgetItems.I}${rowId}`)
  const valorUnitario = getValues(`${tag}${FieldsCodeBudgetItems.VU}${rowId}`)
  const valorConDctoCode = `${tag}${FieldsCodeBudgetItems.VCD}${rowId}`
  const valorTotalCode = `${tag}${FieldsCodeBudgetItems.VT}${rowId}`
  const valorImpuestoCode = `${tag}${FieldsCodeBudgetItems.VI}${rowId}`

  const taxInfo = impuesto
    ? (JSON.parse(impuesto) as InvoiceItemsTaxesDirectus)
    : undefined
  const priceInfo = valorUnitario
    ? (JSON.parse(valorUnitario) as InvoicePriceDirectus)
    : undefined
  const price = priceInfo ? priceInfo.value : 0

  setValue(`${tag}${FieldsCodeBudgetItems.VD}${rowId}`, price * (dcto / 100))
  setValue(valorConDctoCode, price * (1 - dcto / 100))
  setValue(
    valorImpuestoCode,
    getValues(valorConDctoCode) * ((taxInfo ? taxInfo.percentage : 0) / 100),
  )
  setValue(
    valorTotalCode,
    cantidad > 0
      ? cantidad * getValues(valorConDctoCode) +
          cantidad * getValues(valorImpuestoCode)
      : 0,
  )
  setValue(
    `${fieldsStartCode}total_bruto`,
    getInvoiceTotalValorUnitario(getValues),
  )
  setValue(
    `${fieldsStartCode}descuentos`,
    getInvoiceTotal(getValues, FieldsCodeBudgetItems.VD),
  )
  setValue(
    `${fieldsStartCode}subtotal`,
    getInvoiceTotal(getValues, FieldsCodeBudgetItems.VCD),
  )
  setValue(
    `${fieldsStartCode}total_iva`,
    getInvoiceTotal(getValues, FieldsCodeBudgetItems.VI),
  )
  setValue(
    `${fieldsStartCode}total_neto`,
    getInvoiceTotalNeto(getValues(), FieldsCodeBudgetItems.VT),
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
