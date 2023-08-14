'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputSwitch } from 'primereact/inputswitch'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  acceptMessage?: string
}

const InputSwitchValid = <T extends FieldValues>({
  handleForm,
  name,
  acceptMessage,
  required,
  validate,
}: Props<T>) => {
  const {
    formState: { errors },
    control,
  } = handleForm

  return (
    <Controller
      name={name as any}
      control={control}
      rules={{
        required: required ? errorMessages.acceptField : false,
        validate: (value) =>
          validate ? validate(value) || errorMessages.invalidValue : true,
      }}
      render={({
        field: { value, name, ref, onChange },
        fieldState: { error },
      }) => (
        <div className='flex flex-col'>
          <div className='flex gap-2'>
            <InputSwitch
              inputId={name}
              checked={value}
              inputRef={ref}
              className={cx({ 'p-invalid': error }, 'rounded-2xl')}
              onChange={(e) => onChange(e.value)}
            />
            <label className={cx({ 'p-error': errors.checked })}>
              {acceptMessage}
            </label>
          </div>
          <ErrorText name={name} errors={errors} />
        </div>
      )}
    />
  )
}

export default InputSwitchValid
