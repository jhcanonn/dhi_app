import { UseFormReturn } from 'react-hook-form'
import { FoliculosField, FoliculosRow } from '../FoliculosCommon'

export enum RowsCodeFZD {
  FZD_O = 'occipital',
  FZD_T = 'temporal',
}

export enum FieldsCodeFZD {
  FZD_ODE = `foliculos_zd_${RowsCodeFZD.FZD_O}_de`,
  FZD_ODR = `foliculos_zd_${RowsCodeFZD.FZD_O}_dr`,
  FZD_OAA = `foliculos_zd_${RowsCodeFZD.FZD_O}_area_a`,
  FZD_OAB = `foliculos_zd_${RowsCodeFZD.FZD_O}_area_b`,
  FZD_OAT = `foliculos_zd_${RowsCodeFZD.FZD_O}_area_total`,
  FZD_OC = `foliculos_zd_${RowsCodeFZD.FZD_O}_cantidad`,
  FZD_TDE = `foliculos_zd_${RowsCodeFZD.FZD_T}_de`,
  FZD_TDR = `foliculos_zd_${RowsCodeFZD.FZD_T}_dr`,
  FZD_TAA = `foliculos_zd_${RowsCodeFZD.FZD_T}_area_a`,
  FZD_TAB = `foliculos_zd_${RowsCodeFZD.FZD_T}_area_b`,
  FZD_TAT = `foliculos_zd_${RowsCodeFZD.FZD_T}_area_total`,
  FZD_TC = `foliculos_zd_${RowsCodeFZD.FZD_T}_cantidad`,
  FZD_PDE = 'foliculos_zd_promedio_de',
  FZD_TF = 'foliculos_zd_total_foliculos',
  FZD_FD = 'foliculos_zd_foliculos_donar',
  FZD_OBS = 'foliculos_zd_obs',
}

const calcTotalArea = (
  currentValue: number,
  otherZone: 'a' | 'b',
  rowCode: RowsCodeFZD,
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  const { setValue, getValues } = handleForm
  const otherValue = getValues(`foliculos_zd_${rowCode}_area_${otherZone}`) || 0
  const result =
    rowCode === RowsCodeFZD.FZD_O
      ? currentValue * otherValue
      : currentValue * otherValue * 2
  setValue(`foliculos_zd_${rowCode}_area_total`, result)

  const dpeValue = getValues(FieldsCodeFZD.FZD_PDE) || 0
  const atValue = getValues(`foliculos_zd_${rowCode}_area_total`) || 0
  setValue(`foliculos_zd_${rowCode}_cantidad`, dpeValue * atValue)
}

const calcAverageDensidadExistente = (
  currentValue: number,
  otherDE: 'O' | 'T',
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  const { setValue, getValues } = handleForm
  const otherFieldName =
    otherDE === 'O' ? FieldsCodeFZD.FZD_ODE : FieldsCodeFZD.FZD_TDE
  const average = (currentValue + (getValues(otherFieldName) || 0)) / 2
  setValue(FieldsCodeFZD.FZD_PDE, average)
}

const occipitalFields: FoliculosField[] = [
  {
    code: FieldsCodeFZD.FZD_ODE,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcAverageDensidadExistente(e.value || 0, 'T', handleForm),
  },
  { code: FieldsCodeFZD.FZD_ODR, defaultValue: 0 },
  {
    code: FieldsCodeFZD.FZD_OAA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFZD.FZD_O, handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_OAB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFZD.FZD_O, handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_OAT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFZD.FZD_OC,
    defaultValue: 0,
    disabled: true,
  },
]

const temporalFields: FoliculosField[] = [
  {
    code: FieldsCodeFZD.FZD_TDE,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcAverageDensidadExistente(e.value || 0, 'O', handleForm),
  },
  { code: FieldsCodeFZD.FZD_TDR, defaultValue: 0 },
  {
    code: FieldsCodeFZD.FZD_TAA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFZD.FZD_T, handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_TAB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFZD.FZD_T, handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_TAT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFZD.FZD_TC,
    defaultValue: 0,
    disabled: true,
  },
]

export const zonaDonanteRows: FoliculosRow[] = [
  {
    title: 'Occipital',
    fields: occipitalFields,
  },
  {
    title: 'Temporal',
    fields: temporalFields,
  },
]
