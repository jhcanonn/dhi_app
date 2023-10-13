import { FieldErrors, FieldValues } from 'react-hook-form'

type Props<T> = {
  name: string
  errors: FieldErrors<T extends FieldValues ? any : any>
}

const ErrorText = <T extends FieldValues>({ name, errors }: Props<T>) => {
  const fieldError = errors[name]
  return fieldError ? (
    <small className='p-error text-end'>{fieldError?.message + ''}</small>
  ) : (
    <small className='p-error'>&nbsp;</small>
  )
}

export default ErrorText
