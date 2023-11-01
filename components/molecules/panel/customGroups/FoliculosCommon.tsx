import InputNumberValid, {
  InputNumberMode,
} from '@components/atoms/InputNumberValid'
import { InputNumberChangeEvent } from 'primereact/inputnumber'
import { classNames as cx } from 'primereact/utils'
import { UseFormReturn } from 'react-hook-form'
import { RowsCodeFC } from './foliculosCapilarTable/dataFCT'
import { RowsCodeFB } from './foliculosBarbaTable/dataFBT'
import { RowsCodeFCJ } from './foliculosCejaTable/dataFCT'

export type FoliculosRow = {
  title: string
  fields: FoliculosField[]
}

export type FoliculosField = {
  code: string
  defaultValue?: number
  mode?: InputNumberMode
  disabled?: boolean
  required?: boolean
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
              mode={field.mode}
              suffix={field.suffix}
              min={0}
              disabled={field.disabled || disabledData}
              required={field.required}
              onCustomChange={(e) =>
                field.onCustomChange && field.onCustomChange(e, handleForm)
              }
            />
          </td>
        ))}
      </tr>
    )
  })

export enum FoliculosType {
  CAPILAR = 'capilar',
  BARBA = 'barba',
  CEJA = 'ceja',
}

export const calcDensidadRestante = (
  currentValue: number,
  drField: RowsCodeFC | RowsCodeFB | RowsCodeFCJ,
  type: FoliculosType,
  handleForm: UseFormReturn<any, any, undefined>,
  setCantidad: boolean = true,
) => {
  const { setValue, getValues } = handleForm
  const resta = getValues(`foliculos_${type}_odp`) - currentValue
  setValue(`foliculos_${type}_${drField}_dr`, resta >= 0 ? resta : 0)
  setCantidad &&
    setValue(
      `foliculos_${type}_${drField}_cantidad`,
      getValues(`foliculos_${type}_${drField}_dr`) *
        getValues(`foliculos_${type}_${drField}_area_total`),
    )
}

export const calcNoFoliculos = (
  code: string,
  type: FoliculosType,
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  const { setValue, getValues } = handleForm
  const drValue = getValues(`foliculos_${type}_${code}_dr`) || 0
  const atValue = getValues(`foliculos_${type}_${code}_area_total`) || 0
  setValue(`foliculos_${type}_${code}_cantidad`, drValue * atValue)
}

export const calcTotalArea = (
  currentValue: number,
  otherZone: 'a' | 'b',
  rowCode: RowsCodeFC | RowsCodeFB | RowsCodeFCJ,
  type: FoliculosType,
  handleForm: UseFormReturn<any, any, undefined>,
  withPi?: boolean,
) => {
  const { setValue, getValues } = handleForm
  const otherValue =
    getValues(`foliculos_${type}_${rowCode}_area_${otherZone}`) || 0
  const multiplication = currentValue * otherValue
  const result = withPi ? (multiplication * Math.PI) / 4 : multiplication
  setValue(`foliculos_${type}_${rowCode}_area_total`, result)
  calcNoFoliculos(rowCode, type, handleForm)
}
