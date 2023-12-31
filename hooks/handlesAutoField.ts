import { LocalStorageTags } from '@utils'
import { UseFormReturn } from 'react-hook-form'

const handlesAutoField: any = {}

handlesAutoField[LocalStorageTags.CIE10 as keyof any] = (
  _: any,
  selectedValue: string,
  handleForm: UseFormReturn<any, any, undefined>,
  panelCode: string,
) => {
  const { setValue, getValues } = handleForm
  const obsCie10Code = `hc_${
    panelCode === 'consulta_primera_vez' ? 'cpv' : 'control'
  }_observaciones_diagnostico_cie_10`
  const currentValue = getValues(obsCie10Code)
  const value =
    (currentValue ?? '') + ((currentValue ? '\n' : '') + `${selectedValue}`)
  setValue(obsCie10Code, value, { shouldValidate: true })
}

export default handlesAutoField
