'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'

export type Props<T> = FieldCommonProps<T> & {
  list: any[]
  label?: string
  placeholder?: string
  selectedItemsLabel?: string
  onCustomChange?: (e: MultiSelectChangeEvent) => void
}

const MultiSelectValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  placeholder,
  selectedItemsLabel,
  list,
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
      }}
      render={({
        field: { value, name, ref, onBlur, onChange },
        fieldState: { error },
      }) => (
        <div className='flex flex-col'>
          <span className='p-float-label'>
            <MultiSelect
              id={name}
              value={value}
              options={list}
              ref={ref}
              onBlur={onBlur}
              onChange={(e: MultiSelectChangeEvent) => {
                onChange(e.value)
                onCustomChange && onCustomChange(e)
              }}
              optionLabel='name'
              placeholder={placeholder}
              maxSelectedLabels={1}
              selectedItemsLabel={selectedItemsLabel}
              emptyFilterMessage={errorMessages.noExists}
              className={cx(
                { 'p-invalid': error },
                { '[&_.p-multiselect-trigger]:!text-[#dc3545]': error },
              )}
              filter
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

export default MultiSelectValid
