'use client'

import { useEffect } from 'react'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { FieldsCodeFCJ, RowsCodeFCJ, cejaRows } from './dataFCT'
import { InputNumberValid, InputTextareaValid } from '@components/atoms'
import {
  FoliculosType,
  TdTitle,
  TrFoliculos,
  calcNoFoliculos,
} from '../FoliculosCommon'
import { regexPatterns } from '@utils'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const FoliculosCejaTable = ({ handleForm, disabledData }: Props) => {
  const { control, setValue, getValues } = handleForm
  const { _defaultValues } = control

  const cd = useWatch({ control, name: FieldsCodeFCJ.FCJ_CD_C })
  const ci = useWatch({ control, name: FieldsCodeFCJ.FCJ_CI_C })

  useEffect(() => {
    cejaRows.forEach((row) =>
      row.fields.forEach((field) => setValue(field.code, field.defaultValue)),
    )
    setValue(FieldsCodeFCJ.FCJ_PT, 0)
    Object.entries(_defaultValues).forEach(([key, value]) =>
      setValue(key, value),
    )
  }, [])

  useEffect(() => {
    const suma = Object.values(RowsCodeFCJ).reduce(
      (accumulator, code) =>
        accumulator +
        (getValues(`foliculos_${FoliculosType.CEJA}_${code}_cantidad`) || 0),
      0,
    )
    setValue(FieldsCodeFCJ.FCJ_PT, suma)
  }, [cd, ci])

  return (
    <>
      <InputNumberValid
        handleForm={handleForm}
        name={FieldsCodeFCJ.FCJ_ODP}
        label='Objetivo de densidad promedio'
        min={0}
        suffix=' cm²'
        disabled={disabledData}
        onCustomChange={(e) => {
          const currentValue = e.value || 0
          Object.values(RowsCodeFCJ).forEach((code) => {
            const resta =
              currentValue -
              (getValues(`foliculos_${FoliculosType.CEJA}_${code}_de`) || 0)
            setValue(
              `foliculos_${FoliculosType.CEJA}_${code}_dr`,
              resta >= 0 ? resta : 0,
            )
          })
          Object.values(RowsCodeFCJ).forEach((code) =>
            calcNoFoliculos(code, FoliculosType.CEJA, handleForm),
          )
        }}
      />
      <div className='foliculos-table-wrapper'>
        <table role='table' className='foliculos-table'>
          <thead>
            <tr>
              <th className='w-[13%] h-[2.5rem] rounded-l-md'></th>
              <th className='w-[15%]'>Densidad existente</th>
              <th className='w-[15%]'>Densidad restante</th>
              <th className='w-[25%]' colSpan={2}>
                Áreas
              </th>
              <th className='w-[16%]'>Área total</th>
              <th className='w-[16%] rounded-r-md'>No. Pelos</th>
            </tr>
          </thead>
          <tbody>
            <TrFoliculos
              rows={cejaRows}
              handleForm={handleForm}
              disabledData={disabledData}
            />
            <tr>
              <TdTitle colspan={6} right>
                No. de pelos totales
              </TdTitle>
              <td>
                <InputNumberValid
                  handleForm={handleForm}
                  name={FieldsCodeFCJ.FCJ_PT}
                  min={0}
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <InputTextareaValid
        handleForm={handleForm}
        name={FieldsCodeFCJ.FCJ_OBS}
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

export default FoliculosCejaTable
