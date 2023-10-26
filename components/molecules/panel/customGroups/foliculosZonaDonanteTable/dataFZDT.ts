import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { InputNumberChangeEvent } from 'primereact/inputnumber'
import { UseFormReturn } from 'react-hook-form'

export enum FieldsCodeFZD {
  FZD_ODE = 'foliculos_zd_occipital_de',
  FZD_ODR = 'foliculos_zd_occipital_dr',
  FZD_OAA = 'foliculos_zd_occipital_area_za',
  FZD_OAB = 'foliculos_zd_occipital_area_zb',
  FZD_OAT = 'foliculos_zd_occipital_area_total',
  FZD_OC = 'foliculos_zd_occipital_cantidad',
  FZD_TDE = 'foliculos_zd_temporal_de',
  FZD_TDR = 'foliculos_zd_temporal_dr',
  FZD_TAA = 'foliculos_zd_temporal_area_za',
  FZD_TAB = 'foliculos_zd_temporal_area_zb',
  FZD_TAT = 'foliculos_zd_temporal_area_total',
  FZD_TC = 'foliculos_zd_temporal_cantidad',
  FZD_PDE = 'foliculos_zd_promedio_de',
  FZD_TF = 'foliculos_zd_total_foliculos',
  FZD_FD = 'foliculos_zd_foliculos_donar',
  FZD_OBS = 'foliculos_zd_foliculos_obs',
}

type Field = {
  code: string
  defaultValue?: number
  mode?: InputNumberMode
  disabled?: boolean
  suffix?: string
  onCustomChange?: (
    e: InputNumberChangeEvent,
    handleForm: UseFormReturn<any, any, undefined>,
  ) => void
}

const calcTotalArea = (
  currentValue: number,
  otherZone: 'a' | 'b',
  rowTitle: 'occipital' | 'temporal',
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  const { setValue, getValues } = handleForm
  const otherValue =
    +getValues(`foliculos_zd_${rowTitle}_area_z${otherZone}`) || 0
  const result =
    rowTitle === 'occipital'
      ? currentValue * otherValue
      : currentValue * otherValue * 2
  setValue(`foliculos_zd_${rowTitle}_area_total`, result)
}

const calcAverageDensidadExistenteFZD = (
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

const occipitalFields: Field[] = [
  {
    code: FieldsCodeFZD.FZD_ODE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcAverageDensidadExistenteFZD(e.value || 0, 'T', handleForm),
  },
  { code: FieldsCodeFZD.FZD_ODR, suffix: ' cm²' },
  {
    code: FieldsCodeFZD.FZD_OAA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', 'occipital', handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_OAB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', 'occipital', handleForm),
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

const temporalFields: Field[] = [
  {
    code: FieldsCodeFZD.FZD_TDE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcAverageDensidadExistenteFZD(e.value || 0, 'O', handleForm),
  },
  { code: FieldsCodeFZD.FZD_TDR, suffix: ' cm²' },
  {
    code: FieldsCodeFZD.FZD_TAA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', 'temporal', handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_TAB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', 'temporal', handleForm),
  },
  {
    code: FieldsCodeFZD.FZD_TAT,
    defaultValue: 0,
    disabled: true,
  },
  { code: FieldsCodeFZD.FZD_TC, defaultValue: 0, disabled: true },
]

export const fieldsRow = [
  {
    title: 'Occipital',
    fields: occipitalFields,
  },
  {
    title: 'Temporal',
    fields: temporalFields,
  },
]
