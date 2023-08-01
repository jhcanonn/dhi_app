import Image from 'next/image'
import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown'
import { Country, FieldCommonProps } from '@models'
import { COUNTRIES, errorMessages, invalidColor } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  diallingName?: string
  label?: string
  icon?: string
  minLength?: number
}

const PhoneNumberValid = <T extends FieldValues>({
  handleForm,
  name,
  diallingName,
  label,
  icon,
  minLength,
  required,
  validate,
}: Props<T>) => {
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
          src='/assets/logo-secondary.png'
          alt={option.name}
          priority={true}
          width={40}
          height={40}
          className={`mr-2 w-2 flag flag-${option.code.toLowerCase()}`}
        />
        <div>{option.name}</div>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='p-inputgroup flex [&>*:nth-child(1)]:!w-[30%] [&>*:nth-child(2)]:!w-[70%]'>
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
              options={COUNTRIES}
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
                  style={{ color: error ? invalidColor : '' }}
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
              />
              <label htmlFor={name} className={cx({ 'p-error': error })}>
                {label}
              </label>
            </span>
          )}
        />
      </div>
      <div className='flex [&>*:nth-child(1)]:w-[30%] [&>*:nth-child(2)]:w-[70%]'>
        <ErrorText name={diallingName!} errors={errors} />
        <ErrorText name={name} errors={errors} />
      </div>
    </div>
  )
}

export default PhoneNumberValid
