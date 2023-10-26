'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber'
import { FieldCommonProps } from '@models'
import { colors, errorMessages } from '@utils'

export enum InputNumberMode {
  CURRENCY = 'currency',
  DECIMAL = 'decimal',
}

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  disabled?: boolean
  icon?: string
  mode?: InputNumberMode
  suffix?: string
  minLength?: number
  min?: number
  minFractionDigits?: number
  maxFractionDigits?: number
  className?: string
  onCustomChange?: (e: InputNumberChangeEvent) => void
}

const InputNumberValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  disabled,
  icon,
  mode,
  suffix,
  minLength,
  min,
  minFractionDigits,
  maxFractionDigits,
  className,
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
      }) => {
        let inputNumberProps: any = {
          id: name,
          value: value ?? undefined,
          inputRef: ref,
          onBlur,
          onChange: (e: InputNumberChangeEvent) => {
            onChange(e.value)
            onCustomChange && onCustomChange(e)
          },
          inputClassName: cx({ 'p-invalid': error }),
          useGrouping: false,
          mode,
          disabled,
          className: "[&_[type='button']]:bg-defaultBlue",
          suffix,
          minFractionDigits:
            mode === InputNumberMode.DECIMAL
              ? minFractionDigits ?? 2
              : undefined,

          maxFractionDigits:
            mode === InputNumberMode.DECIMAL
              ? maxFractionDigits ?? 5
              : undefined,
        }

        if (min !== undefined) inputNumberProps = { ...inputNumberProps, min }

        return (
          <div className={`flex flex-col ${className}`}>
            <span
              className={cx('p-float-label', { 'p-input-icon-left': icon })}
            >
              {icon && (
                <i
                  className={cx(`pi pi-${icon}`)}
                  style={{ color: error ? colors.invalid : '' }}
                />
              )}
              <InputNumber {...inputNumberProps} />
              <label htmlFor={name} className={cx({ 'p-error': error })}>
                {label}
              </label>
            </span>
            <ErrorText name={name} errors={errors} />
          </div>
        )
      }}
    />
  )
}

export default InputNumberValid
