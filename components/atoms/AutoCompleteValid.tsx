'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { FieldCommonProps } from '@models'
import { colors, errorMessages } from '@utils'
import {
  AutoComplete,
  AutoCompleteChangeEvent,
  AutoCompleteCompleteEvent,
} from 'primereact/autocomplete'
import { ReactNode } from 'react'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  icon?: string
  disabled?: boolean
  className?: string
  field: string
  itemTemplate: ReactNode | ((option: any) => ReactNode)
  suggestions: any[]
  completeMethod: (event: AutoCompleteCompleteEvent) => void
  onCustomChange?: (e: AutoCompleteChangeEvent) => void
}

const AutoCompleteValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  icon,
  disabled,
  className,
  field,
  itemTemplate,
  suggestions,
  required,
  validate,
  completeMethod,
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
      }}
      render={({
        field: { value, name, ref, onChange },
        fieldState: { error },
      }) => (
        <div className={`flex flex-col w-full ${className}`}>
          <span className={cx('p-float-label', { 'p-input-icon-left': icon })}>
            {icon && (
              <i
                className={cx(`pi pi-${icon}`, { 'z-10': !disabled })}
                style={{ color: error ? colors.invalid : '' }}
              />
            )}
            <AutoComplete
              field={field}
              inputId={name}
              value={value}
              inputRef={ref}
              suggestions={suggestions}
              completeMethod={completeMethod}
              itemTemplate={itemTemplate}
              onChange={(e: AutoCompleteChangeEvent) => {
                onChange(e.value)
                onCustomChange && onCustomChange(e)
              }}
              className={cx({ 'p-invalid': error })}
              disabled={disabled}
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

export default AutoCompleteValid
