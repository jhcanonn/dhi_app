import { UseFormReturn } from 'react-hook-form'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { InputNumberChangeEvent } from 'primereact/inputnumber'
import { HC_IMPLANTE_CODE } from '@utils'

export const GRAFT_QUANTITY = 7

type GraftField = {
  code: string
  label?: string
  defaultValue?: number
  mode?: InputNumberMode
  disabled?: boolean
  suffix?: string
  colspan?: number
  onCustomChange?: (
    e: InputNumberChangeEvent,
    handleForm: UseFormReturn<any, any, undefined>,
    day: number,
  ) => void
}

export enum FieldsCodeED {
  ED_CDE = `${HC_IMPLANTE_CODE}cantidad_dias_extraccion`,
  ED_FI = `${HC_IMPLANTE_CODE}fecha_inicio`,
  ED_G = `${HC_IMPLANTE_CODE}graft`,
  ED_GT = `${HC_IMPLANTE_CODE}graft_total`,
  ED_GF = `${HC_IMPLANTE_CODE}gfoliculos`,
  ED_GFT = `${HC_IMPLANTE_CODE}gfoliculos_total`,
  ED_R = `${HC_IMPLANTE_CODE}radio`,
  ED_FF = `${HC_IMPLANTE_CODE}fecha_fin`,
  ED_SV = `${HC_IMPLANTE_CODE}signos_vitales`,
}

const calcDayTotal = (
  handleForm: UseFormReturn<any, any, undefined>,
  startCode: FieldsCodeED,
  totalCode: FieldsCodeED,
  dayCode: string,
) => {
  const { setValue, getValues } = handleForm
  const regex = new RegExp(`${startCode}\\d+${dayCode}`)
  const sum = graftFields
    .filter((field) => `${field.code}${dayCode}`.match(regex))
    .reduce(
      (acc, field) => acc + (getValues(`${field.code}${dayCode}`) || 0),
      0,
    )
  setValue(`${totalCode}${dayCode}`, sum)
}

export const calcTotalED = (
  handleForm: UseFormReturn<any, any, undefined>,
  startCode: FieldsCodeED,
  index: number,
  isTotal?: boolean,
) => {
  const { setValue, getValues } = handleForm
  const regex = new RegExp(`${startCode}${isTotal ? '' : index}_dia\\d+`)

  const sum = Object.entries(getValues())
    .filter(([key]) => key.match(regex))
    .reduce((acc, [, value]) => acc + (Number(value) || 0), 0)

  setValue(`${startCode}${isTotal ? '' : `${index}_total`}`, sum)
}

const calcByChange = (
  handleForm: UseFormReturn<any, any, undefined>,
  currentValue: number,
  day: number,
  index: number,
) => {
  const { setValue } = handleForm
  const dayCode = `_dia${day}`
  setValue(`${FieldsCodeED.ED_GF}${index}${dayCode}`, currentValue * index)
  calcDayTotal(handleForm, FieldsCodeED.ED_G, FieldsCodeED.ED_GT, dayCode)
  calcDayTotal(handleForm, FieldsCodeED.ED_GF, FieldsCodeED.ED_GFT, dayCode)
  calcTotalED(handleForm, FieldsCodeED.ED_G, index)
  calcTotalED(handleForm, FieldsCodeED.ED_GF, index)
  calcTotalED(handleForm, FieldsCodeED.ED_GT, index, true)
  calcTotalED(handleForm, FieldsCodeED.ED_GFT, index, true)
}

export let graftFields: GraftField[] = []

for (let i = 1; i <= GRAFT_QUANTITY; i++) {
  graftFields = [
    ...graftFields,
    {
      code: `${FieldsCodeED.ED_G}${i}`,
      label: `Graft ${i}`,
      onCustomChange: (e, handleForm, day) =>
        calcByChange(handleForm, e.value || 0, day, i),
    },
    {
      code: `${FieldsCodeED.ED_GF}${i}`,
      label: `Foliculos`,
      defaultValue: 0,
      disabled: true,
    },
  ]
}
