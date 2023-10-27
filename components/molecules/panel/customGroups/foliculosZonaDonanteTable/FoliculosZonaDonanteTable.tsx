'use client'

import { InputNumberValid, InputTextareaValid } from '@components/atoms'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { FieldsCodeFZD, fieldsRow } from './dataFZDT'
import { classNames as cx } from 'primereact/utils'
import { regexPatterns } from '@utils'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const TdTitle = ({
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

const FoliculosZonaDonanteTable = ({ handleForm, disabledData }: Props) => {
  const { control, setValue, getValues } = handleForm
  const { _defaultValues } = control

  const totalAreaA = useWatch({ control, name: FieldsCodeFZD.FZD_OAT })
  const totalAreaB = useWatch({ control, name: FieldsCodeFZD.FZD_TAT })
  const avarageDE = useWatch({ control, name: FieldsCodeFZD.FZD_PDE })
  const cantidadO = useWatch({ control, name: FieldsCodeFZD.FZD_OC })
  const cantidadT = useWatch({ control, name: FieldsCodeFZD.FZD_TC })

  useEffect(() => {
    fieldsRow.forEach((row) =>
      row.fields.forEach((field) => setValue(field.code, field.defaultValue)),
    )
    setValue(FieldsCodeFZD.FZD_PDE, 0)
    setValue(FieldsCodeFZD.FZD_TF, 0)
    setValue(FieldsCodeFZD.FZD_FD, 0)

    Object.entries(_defaultValues).forEach(([key, value]) =>
      setValue(key, value),
    )
  }, [])

  useEffect(() => {
    setValue(
      FieldsCodeFZD.FZD_OC,
      totalAreaA * getValues(FieldsCodeFZD.FZD_PDE),
    )
  }, [totalAreaA])

  useEffect(() => {
    setValue(
      FieldsCodeFZD.FZD_TC,
      totalAreaB * getValues(FieldsCodeFZD.FZD_PDE),
    )
  }, [totalAreaB])

  useEffect(() => {
    setValue(FieldsCodeFZD.FZD_OC, avarageDE * getValues(FieldsCodeFZD.FZD_OAT))
    setValue(FieldsCodeFZD.FZD_TC, avarageDE * getValues(FieldsCodeFZD.FZD_TAT))
  }, [avarageDE])

  useEffect(() => {
    const suma =
      getValues(FieldsCodeFZD.FZD_OC) + getValues(FieldsCodeFZD.FZD_TC)
    setValue(FieldsCodeFZD.FZD_TF, suma)
    setValue(FieldsCodeFZD.FZD_FD, suma / 2)
  }, [cantidadO, cantidadT])

  return (
    <>
      <div className='border border-brandGrouperColor rounded-[4px] pl-3 pr-4 pt-3 relative overflow-auto'>
        <table
          role='table'
          className='w-full [&_th]:bg-gray-300/40 [&_th]:text-center'
        >
          <thead>
            <tr>
              <th className='w-[10%] h-[2.5rem] rounded-l-md'></th>
              <th className='w-[15%]'>Densidad existente</th>
              <th className='w-[15%]'>Densidad restante</th>
              <th className='w-[25%]' colSpan={2}>
                Áreas
              </th>
              <th className='w-[17.5%]'>Área total</th>
              <th className='w-[17.5%] rounded-r-md'>No. Folículos</th>
            </tr>
          </thead>
          <tbody>
            {fieldsRow.map(({ title, fields }) => {
              const className = cx({ 'pt-3': title === 'Occipital' })
              return (
                <tr key={title}>
                  <TdTitle className={className}>{title}</TdTitle>
                  {fields.map((field) => (
                    <td key={field.code} className={className}>
                      <InputNumberValid
                        handleForm={handleForm}
                        name={field.code}
                        mode={field.mode ?? InputNumberMode.DECIMAL}
                        suffix={field.suffix}
                        min={0}
                        disabled={field.disabled || disabledData}
                        required
                        onCustomChange={(e) =>
                          field.onCustomChange &&
                          field.onCustomChange(e, handleForm)
                        }
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
            <tr>
              <TdTitle>Promedio</TdTitle>
              <td>
                <InputNumberValid
                  handleForm={handleForm}
                  name={FieldsCodeFZD.FZD_PDE}
                  mode={InputNumberMode.DECIMAL}
                  min={0}
                  suffix=' cm²'
                  disabled
                  required
                />
              </td>
              <TdTitle colspan={4} right>
                Total folículos
              </TdTitle>
              <td>
                <InputNumberValid
                  handleForm={handleForm}
                  name={FieldsCodeFZD.FZD_TF}
                  mode={InputNumberMode.DECIMAL}
                  min={0}
                  disabled
                  required
                />
              </td>
            </tr>
            <tr>
              <TdTitle colspan={6} right>
                No. de pelo para donar
              </TdTitle>
              <td>
                <InputNumberValid
                  handleForm={handleForm}
                  name={FieldsCodeFZD.FZD_FD}
                  mode={InputNumberMode.DECIMAL}
                  min={0}
                  disabled
                  required
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <InputTextareaValid
        handleForm={handleForm}
        name={FieldsCodeFZD.FZD_OBS}
        label='Observaciones'
        pattern={regexPatterns.onlyEmpty}
        rows={3}
        autoResize
        className='mt-4'
        disabled={disabledData}
      />
    </>
  )
}

export default FoliculosZonaDonanteTable
