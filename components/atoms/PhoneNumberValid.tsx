'use client'

import Image from 'next/image'
import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Country, FieldCommonProps } from '@models'
import { colors, errorMessages } from '@utils'
import { useGlobalContext } from '@contexts'

export type Props<T> = FieldCommonProps<T> & {
  diallingName?: string
  label?: string
  disabled?: boolean
  icon?: string
  minLength?: number
  className?: string
}

const PhoneNumberValid = <T extends FieldValues>({
  handleForm,
  name,
  diallingName,
  label,
  disabled,
  icon,
  minLength,
  className,
  required,
  validate,
}: Props<T>) => {
  const { countries } = useGlobalContext()
  const {
    formState: { errors },
    control,
  } = handleForm

  const selectedCountryTemplate = (option: Country, props: any) => {
    if (option) {
      return (
        <div className='flex items-center'>
          <div>{option.dialling}</div>
        </div>
      )
    }
    return <span>{props.placeholder}</span>
  }

  const countryOptionTemplate = (option: Country) => {
    return (
      <div className='flex items-center'>
        <Image
          src={option.image_url}
          alt={option.name}
          priority={true}
          width={20}
          height={20}
          className={`mr-2 !w-5`}
        />
        <div>{option.name}</div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className='p-inputgroup flex [&>*:nth-child(1)]:!w-[36%] [&>*:nth-child(2)]:!w-[64%]'>
        {/* Dailling field */}
        <Controller
          name={diallingName as any}
          control={control}
          rules={{
            required: required ? 'Obligatorio.' : false,
          }}
          render={({
            field: { onBlur, onChange, value, name, ref },
            fieldState: { error },
          }) => (
            <Dropdown
              id={name}
              value={value}
              optionLabel='dialling'
              placeholder='+__'
              options={countries}
              focusInputRef={ref}
              onBlur={onBlur}
              onChange={(e) => onChange(e.value)}
              className={cx(
                { 'p-invalid': error },
                { '[&_.p-placeholder]:!text-[#dc3545]': error },
                { '[&_.p-dropdown-trigger]:!text-[#dc3545]': error },
              )}
              valueTemplate={selectedCountryTemplate}
              itemTemplate={countryOptionTemplate}
              filter
              filterBy='name,dialling'
              disabled={disabled}
            />
          )}
        />
        {/* Phone field */}
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
            <span
              className={cx(
                'p-float-label [&_input]:!rounded-l-none [&_input]:!border-l-0',
                { 'p-input-icon-left': icon },
              )}
            >
              {icon && (
                <i
                  className={cx(`pi pi-${icon}`)}
                  style={{ color: error ? colors.invalid : '' }}
                />
              )}
              <InputNumber
                id={name}
                value={value}
                inputRef={ref}
                onBlur={(e) => {
                  onBlur()
                  onChange(e.target.value)
                }}
                onChange={(e) => onChange(e.value)}
                onInput={onChange}
                inputClassName={cx({ 'p-invalid': error })}
                useGrouping={false}
                aria-autocomplete='none'
                disabled={disabled}
              />
              <label htmlFor={name} className={cx({ 'p-error': error })}>
                {label}
              </label>
            </span>
          )}
        />
      </div>
      <div className='flex [&>*:nth-child(1)]:w-[36%] [&>*:nth-child(2)]:w-[64%]'>
        <ErrorText name={diallingName!} errors={errors} />
        <ErrorText name={name} errors={errors} />
      </div>
    </div>
  )
}

export default PhoneNumberValid
