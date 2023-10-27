import InputNumberValid, {
  InputNumberMode,
} from '@components/atoms/InputNumberValid'
import { InputNumberChangeEvent } from 'primereact/inputnumber'
import { classNames as cx } from 'primereact/utils'
import { UseFormReturn } from 'react-hook-form'

export type FoliculosRow = {
  title: string
  fields: FoliculosField[]
}

export type FoliculosField = {
  code: string
  defaultValue?: number
  mode?: InputNumberMode
  disabled?: boolean
  suffix?: string
  colspan?: number
  onCustomChange?: (
    e: InputNumberChangeEvent,
    handleForm: UseFormReturn<any, any, undefined>,
  ) => void
}

export const TdTitle = ({
  children,
  right,
  colspan,
  className,
}: {
  children: React.ReactNode
  right?: boolean
  colspan?: number
  className?: string
}) => (
  <td colSpan={colspan} className={className}>
    <div className='flex flex-col justify-center px-2'>
      <div
        className={cx('flex items-center font-bold h-[39.19px]', {
          'justify-end': right,
        })}
      >
        <p className={cx({ 'text-right': right })}>{children}</p>
      </div>
      <div className='h-[20px]'> </div>
    </div>
  </td>
)

type TrFoliculosProps = {
  rows: FoliculosRow[]
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

export const TrFoliculos = ({
  rows,
  handleForm,
  disabledData,
}: TrFoliculosProps) =>
  rows.map(({ title, fields }, index) => {
    const className = cx({ 'pt-3': index === 0 })
    return (
      <tr key={title}>
        <TdTitle className={className}>{title}</TdTitle>
        {fields.map((field) => (
          <td key={field.code} className={className} colSpan={field.colspan}>
            <InputNumberValid
              handleForm={handleForm}
              name={field.code}
              mode={field.mode ?? InputNumberMode.DECIMAL}
              suffix={field.suffix}
              min={0}
              disabled={field.disabled || disabledData}
              required
              onCustomChange={(e) =>
                field.onCustomChange && field.onCustomChange(e, handleForm)
              }
            />
          </td>
        ))}
      </tr>
    )
  })
