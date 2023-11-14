'use client'

import { InputNumberValid, InputTextareaValid } from '@components/atoms'
import { useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { FieldsCodeFZD, zonaDonanteRows } from './dataFZDT'
import { regexPatterns } from '@utils'
import { TdTitle, TrFoliculos } from '../FoliculosCommon'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const FoliculosZonaDonanteTable = ({ handleForm, disabledData }: Props) => {
  const { control, setValue, getValues } = handleForm
  const { _defaultValues } = control

  const avarageDE = useWatch({ control, name: FieldsCodeFZD.FZD_PDE })
  const cantidadO = useWatch({ control, name: FieldsCodeFZD.FZD_OC })
  const cantidadT = useWatch({ control, name: FieldsCodeFZD.FZD_TC })

  useEffect(() => {
    zonaDonanteRows.forEach((row) =>
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
      <div className='foliculos-table-wrapper'>
        <table role='table' className='foliculos-table'>
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
            <TrFoliculos
              rows={zonaDonanteRows}
              handleForm={handleForm}
              disabledData={disabledData}
            />
            <tr>
              <TdTitle>Promedio</TdTitle>
              <td>
                <InputNumberValid
                  handleForm={handleForm}
                  name={FieldsCodeFZD.FZD_PDE}
                  min={0}
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
