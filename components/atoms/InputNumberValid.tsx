'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber'
import { FieldCommonProps } from '@models'
import { colors, errorMessages } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  disabled?: boolean
  icon?: string
  mode?: 'currency' | 'decimal'
  minLength?: number
  min?: number
  onCustomChange?: (e: InputNumberChangeEvent) => void
}

const InputNumberValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  disabled,
  icon,
  mode,
  minLength,
  min = 0,
  required,
  validate,
  onCustomChange,
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
        required: required ? errorMessages.mandatoryField : false,
        validate: (value) =>
          validate ? validate(value) || errorMessages.invalidValue : true,
        minLength: minLength && {
          value: minLength,
          message: `${errorMessages.minLength} ${minLength}`,
        },
      }}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { error },
      }) => (
        <div className='flex flex-col'>
          <span className={cx('p-float-label', { 'p-input-icon-left': icon })}>
            {icon && (
              <i
                className={cx(`pi pi-${icon}`)}
                style={{ color: error ? colors.invalid : '' }}
              />
            )}
            <InputNumber
              id={name}
              value={value || undefined}
              inputRef={ref}
              onBlur={(e) => {
                onBlur()
                onChange(e.target.value)
              }}
              onChange={(e) => {
                onChange(e.value)
                onCustomChange && onCustomChange(e)
              }}
              inputClassName={cx({ 'p-invalid': error })}
              useGrouping={false}
              mode={mode}
              disabled={disabled}
              className={"[&_[type='button']]:bg-defaultBlue"}
              min={min}
            />
            <label htmlFor={name} className={cx({ 'p-error': error })}>
              {label}
            </label>
          </span>
          <ErrorText name={name} errors={errors} />
        </div>
      )}
    />
  )
}

export default InputNumberValid
