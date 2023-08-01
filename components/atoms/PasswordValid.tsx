import { ErrorText } from '.'
import { Controller, FieldValues } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import { Password } from 'primereact/password'
import { FieldCommonProps } from '@models'
import { errorMessages, invalidColor } from '@utils'

export type Props<T> = FieldCommonProps<T> & {
  label?: string
  icon?: string
  disabled?: boolean
}

const PasswordValid = <T extends FieldValues>({
  handleForm,
  name,
  label,
  icon,
  disabled = false,
  required,
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
      }}
      render={({
        field: { value, name, ref, onBlur, onChange },
        fieldState: { error },
      }) => (
        <div className='flex flex-col w-full'>
          <span className={cx('p-float-label', { 'p-input-icon-left': icon })}>
            {icon && (
              <i
                className={`pi pi-${icon} z-10`}
                style={{ color: error ? invalidColor : '' }}
              />
            )}
            <Password
              id={name}
              value={value}
              inputRef={ref}
              onBlur={(e) => {
                onBlur()
                onChange(e.target.value)
              }}
              onChange={(e) => onChange(e.target.value)}
              onPaste={(e) => {
                onChange(e.currentTarget.value)
              }}
              className={cx(
                { 'p-invalid': error },
                { '[&_svg]:text-invalid': error },
                'w-full [&_input]:w-full [&_svg]:mt-[-0.7rem]',
              )}
              disabled={disabled}
              promptLabel='Escribe una contraseña'
              weakLabel='Muy simple'
              mediumLabel='Complejidad media'
              strongLabel='Contraseña compleja'
              toggleMask
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

export default PasswordValid
