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
  showTime?: boolean
}

const DateTimeValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  disabled,
  showTime = true,
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
        <div className='flex flex-col'>
          <span className='p-float-label'>
            <Calendar
              ref={ref}
              inputId={name}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              locale={localeCode}
              dateFormat='dd/mm/yy'
              hourFormat='12'
              showIcon
              showTime={showTime}
              disabled={disabled}
              className={cx(
                { 'p-invalid': error },
                '[&_button]:bg-[var(--primary-color)]',
              )}
              stepMinute={30}
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
