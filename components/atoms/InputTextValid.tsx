import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { InputText } from 'primereact/inputtext'
import { FieldCommonProps } from '@models'
import { errorMessages, invalidColor } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  icon?: string
  disabled?: boolean
  pattern?: RegExp
}

const InputTextValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  icon,
  disabled = false,
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
      render={({
        field: { value, name, ref, onBlur, onChange },
        fieldState: { error },
      }) => (
        <div className='flex flex-col w-full'>
          <span className={cx('p-float-label', { 'p-input-icon-left': icon })}>
            {icon && (
              <i
                className={`pi pi-${icon}`}
                style={{ color: error ? invalidColor : '' }}
              />
            )}
            <InputText
              id={name}
              value={value}
              ref={ref}
              onBlur={(e) => {
                onBlur()
                onChange(e.target.value)
              }}
              onChange={(e) => onChange(e.target.value)}
              className={cx({ 'p-invalid': error }, 'w-full')}
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

export default InputTextValid
