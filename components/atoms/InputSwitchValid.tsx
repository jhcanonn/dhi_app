'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  acceptMessage?: string
  disabled?: boolean
  className?: string
  onCustomChange?: (e: InputSwitchChangeEvent) => void
}

const InputSwitchValid = <T extends FieldValues>({
  handleForm,
  name,
  acceptMessage,
  disabled,
  required,
  className,
  onCustomChange,
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
        <div className={`flex flex-col justify-center ${className}`}>
          <div className='flex gap-2 items-center'>
            <InputSwitch
              inputId={name}
              checked={!!value}
              inputRef={ref}
              className={cx({ 'p-invalid': error }, 'rounded-2xl')}
              onChange={(e: InputSwitchChangeEvent) => {
                onChange(e.value)
                onCustomChange && onCustomChange(e)
              }}
              disabled={disabled}
            />
            {acceptMessage && (
              <label className={cx({ 'p-error': errors.checked })}>
                {acceptMessage}
              </label>
            )}
          </div>
          <ErrorText name={name} errors={errors} />
        </div>
      )}
    />
  )
}

export default InputSwitchValid
