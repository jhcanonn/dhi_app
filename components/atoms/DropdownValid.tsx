'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import {
  Dropdown,
  DropdownChangeEvent,
  DropdownProps,
} from 'primereact/dropdown'
import { FieldCommonProps } from '@models'
import { errorMessages } from '@utils'
import { ReactNode } from 'react'

export type Props<T> = FieldCommonProps<T> & {
  list: any[]
  showClear?: boolean
  label?: string
  placeholder?: string
  emptyMessage?: ReactNode | ((props: DropdownProps) => ReactNode)
  itemTemplate?: ReactNode | ((option: any) => ReactNode)
  valueTemplate?: ReactNode | ((option: any, props: DropdownProps) => ReactNode)
  onCustomChange?: (e: DropdownChangeEvent) => void
}

const DropdownValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  placeholder,
  list,
  showClear = false,
  required,
  validate,
  emptyMessage,
  itemTemplate,
  valueTemplate,
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
            <Dropdown
              id={name}
              value={value}
              optionLabel='name'
              options={list}
              focusInputRef={ref}
              onBlur={onBlur}
              onChange={(e) => {
                onChange(e.value)
                onCustomChange && onCustomChange(e)
              }}
              className={cx(
                { 'p-invalid': error },
                { '[&_.p-dropdown-trigger]:!text-[#dc3545]': error },
              )}
              filter
              placeholder={placeholder}
              showClear={showClear}
              emptyMessage={emptyMessage}
              itemTemplate={itemTemplate}
              valueTemplate={valueTemplate}
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

export default DropdownValid
