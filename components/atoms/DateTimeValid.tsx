'use client'

import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { FieldCommonProps } from '@models'
import { errorMessages, localeOptions } from '@utils'
import { Calendar } from 'primereact/calendar'
import { useCalendarContext } from '@contexts'
import { addLocale } from 'primereact/api'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  disabled?: boolean
  stepMinute?: number
  showIcon?: boolean
  showTime?: boolean
  onlyYear?: boolean
  className?: string
}

const DateTimeValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  disabled,
  stepMinute = 30,
  showIcon = true,
  showTime = true,
  onlyYear,
  className,
  required,
  validate,
}: Props<T>) => {
  const { calendarScheduler } = useCalendarContext()
  const localeCode = calendarScheduler?.current?.scheduler.locale.code || 'es'
  const {
    formState: { errors },
    control,
  } = handleForm

  addLocale(localeCode, localeOptions)

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
        <div className={`flex flex-col ${className}`}>
          <span className='p-float-label'>
            <Calendar
              ref={ref}
              inputId={name}
              value={value || null}
              onBlur={onBlur}
              onChange={onChange}
              locale={localeCode}
              view={onlyYear ? 'year' : 'date'}
              dateFormat={onlyYear ? 'yy' : 'dd/mm/yy'}
              hourFormat='12'
              showIcon={showIcon}
              showTime={showTime}
              hideOnDateTimeSelect={showTime}
              disabled={disabled}
              className={cx(
                { 'p-invalid': error },
                '[&_button]:bg-[var(--primary-color)]',
              )}
              stepMinute={stepMinute}
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

export default DateTimeValid
