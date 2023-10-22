import { LOCAL_STORAGE_TAGS } from '@utils'
import { UseFormReturn } from 'react-hook-form'

const handlesAutoField: any = {}

handlesAutoField[LOCAL_STORAGE_TAGS.CIE10 as keyof any] = (
  item: any,
  selectedValue: string,
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  if (item && typeof item === 'object') {
    const { setValue, getValues, trigger } = handleForm
    const obsCie10Code = 'observaciones_diagnostico_cie_10'
    const currentValue = getValues(obsCie10Code)
    const value =
      (currentValue ?? '') + ((currentValue ? '\n' : '') + `${selectedValue}`)
    setValue(obsCie10Code, value, { shouldValidate: true })
    trigger(obsCie10Code, { shouldFocus: true })
  }
}

export default handlesAutoField
