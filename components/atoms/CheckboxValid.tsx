'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { CamposOpcionesDirectus, FieldCommonProps } from '@models'
import { errorMessages } from '@utils'
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox'
import { useState } from 'react'

export type Props<T> = FieldCommonProps<T> & {
  list: CamposOpcionesDirectus[]
  label?: string
  gridRows?: number
  disabled?: boolean
  pattern?: RegExp
  className?: string
}

const CheckboxValid = <T extends FieldValues>({
  handleForm,
  name,
  list,
  label,
  gridRows,
  disabled = false,
  pattern,
  className,
  required,
  validate,
}: Props<T>) => {
  const {
    formState: { errors, defaultValues },
    control,
  } = handleForm

  const df = { ...defaultValues }
  const [options, setOptions] = useState<CamposOpcionesDirectus[]>(
    df[name] ?? [],
  )

  const onOptionChange = (
    e: CheckboxChangeEvent,
    onChange: (...event: any[]) => void,
  ) => {
    let _options = [...options]
    if (e.checked) _options.push(e.value)
    else _options = _options.filter((option) => option.value !== e.value.value)
    setOptions(_options)
    onChange(_options)
  }

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
        field: { name, ref, onBlur, onChange },
        fieldState: { error },
      }) => {
        return (
          <div
            className={cx(
              className,
              'flex flex-col w-full',
              { 'row-span-2': gridRows === 2 },
              { 'row-span-3': gridRows === 3 },
              { 'row-span-4': gridRows === 4 },
              { 'row-span-5': gridRows === 5 },
            )}
          >
            <div className='custom-field-border'>
              <div className='flex flex-wrap gap-3 py-[0.25rem]'>
                {list.map((item) => {
                  const key = item.value
                  const label = item.name
                  return (
                    <div key={key} className='flex align-items-center gap-1'>
                      <div>
                        <Checkbox
                          inputId={key}
                          name={name}
                          value={item}
                          inputRef={ref}
                          disabled={disabled}
                          onBlur={onBlur}
                          onChange={(e) => {
                            onOptionChange(e, onChange)
                          }}
                          checked={
                            options?.length > 0
                              ? options.some((item) => item.value === key)
                              : false
                          }
                          className={cx({ 'p-invalid': error }, 'w-full')}
                        />
                      </div>
                      <label
                        htmlFor={key}
                        className={cx('text-[0.8rem]', { 'p-error': error })}
                      >
                        {label}
                      </label>
                    </div>
                  )
                })}
              </div>
              <label className='custom-float-label'>{label}</label>
            </div>
            <ErrorText name={name} errors={errors} />
          </div>
        )
      }}
    />
  )
}

export default CheckboxValid
