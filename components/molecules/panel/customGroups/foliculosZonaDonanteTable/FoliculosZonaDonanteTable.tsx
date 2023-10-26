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
}

const TdTitle = ({
  children,
  right,
  colspan,
}: {
  children: React.ReactNode
  right?: boolean
  colspan?: number
}) => (
  <td colSpan={colspan}>
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

const FoliculosZonaDonanteTable = ({ handleForm }: Props) => {
  const { control, setValue, getValues } = handleForm
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
        <table role='table' className='w-full'>
          <thead>
            <tr>
              <th className='w-[10%] h-[2.5rem]'></th>
              <th className='w-[15%]'>Densidad existente</th>
              <th className='w-[15%]'>Densidad restante</th>
              <th className='w-[25%]' colSpan={2}>
                Áreas
              </th>
              <th className='w-[17.5%]'>Área total</th>
              <th className='w-[17.5%]'>No. Folículos</th>
            </tr>
          </thead>
          <tbody>
            {fieldsRow.map(({ title, fields }) => (
              <tr key={title}>
                <TdTitle>{title}</TdTitle>
                {fields.map((field) => (
                  <td key={field.code}>
                    <InputNumberValid
                      handleForm={handleForm}
                      name={field.code}
                      mode={field.mode ?? InputNumberMode.DECIMAL}
                      suffix={field.suffix}
                      min={0}
                      disabled={field.disabled}
                      required
                      onCustomChange={(e) =>
                        field.onCustomChange &&
                        field.onCustomChange(e, handleForm)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
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
      />
    </>
  )
}

export default FoliculosZonaDonanteTable
