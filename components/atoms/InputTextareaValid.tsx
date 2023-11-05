'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputTextarea } from 'primereact/inputtextarea'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  gridRows?: number
  disabled?: boolean
  rows?: number
  autoResize?: boolean
  pattern?: RegExp
  className?: string
}

const InputTextareaValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  gridRows,
  disabled,
  rows,
  autoResize = true,
  pattern,
  className,
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
        required: required ? errorMessages.mandatoryField : false,
        validate: (value) =>
          validate ? validate(value) || errorMessages.invalidValue : true,
        pattern: pattern && {
          value: pattern,
          message: errorMessages.invalidFormat,
        },
      }}
      render={({
        field: { name, value, ref, onChange, onBlur },
        fieldState: { error },
      }) => (
        <div
          className={cx(
            className,
            'flex flex-col',
            { 'row-span-2': gridRows === 2 },
            { 'row-span-3': gridRows === 3 },
            { 'row-span-4': gridRows === 4 },
            { 'row-span-5': gridRows === 5 },
          )}
        >
          <span className='p-float-label'>
            <InputTextarea
              id={name}
              value={value || ''}
              ref={ref}
              onBlur={(e) => {
                onBlur()
                onChange(e.target.value)
              }}
              onChange={(e) => onChange(e.target.value)}
              rows={rows}
              className={cx({ 'p-invalid': error }, 'w-full')}
              autoResize={autoResize}
              readOnly={disabled}
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

export default InputTextareaValid
