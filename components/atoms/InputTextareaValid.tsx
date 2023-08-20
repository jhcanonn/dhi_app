'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputTextarea } from 'primereact/inputtextarea'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  rows?: number
  pattern?: RegExp
}

const InputTextareaValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  rows,
  pattern,
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
      render={({ field, fieldState: { error } }) => (
        <div className='flex flex-col'>
          <span className='p-float-label'>
            <InputTextarea
              id={field.name}
              {...field}
              rows={rows}
              className={cx({ 'p-invalid': error }, 'w-full')}
              autoResize
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
