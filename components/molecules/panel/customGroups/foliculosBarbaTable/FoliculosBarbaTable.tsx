'use client'

import { InputNumberValid, InputTextareaValid } from '@components/atoms'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { FieldsCodeFB, RowsCodeFB, barbaRows } from './dataFBT'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import {
  FoliculosType,
  TdTitle,
  TrFoliculos,
  calcNoFoliculos,
} from '../FoliculosCommon'
import { regexPatterns } from '@utils'
import { useEffect } from 'react'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const FoliculosBarbaTable = ({ handleForm, disabledData }: Props) => {
  const { control, setValue, getValues } = handleForm
  const { _defaultValues } = control

  const ld = useWatch({ control, name: FieldsCodeFB.FB_LD_C })
  const li = useWatch({ control, name: FieldsCodeFB.FB_LI_C })
  const cd = useWatch({ control, name: FieldsCodeFB.FB_CD_C })
  const ci = useWatch({ control, name: FieldsCodeFB.FB_CI_C })
  const b = useWatch({ control, name: FieldsCodeFB.FB_B_C })
  const m = useWatch({ control, name: FieldsCodeFB.FB_M_C })
  const mm = useWatch({ control, name: FieldsCodeFB.FB_MM_C })
  const pd = useWatch({ control, name: FieldsCodeFB.FB_PD_C })
  const pi = useWatch({ control, name: FieldsCodeFB.FB_PI_C })

  useEffect(() => {
    barbaRows.forEach((row) =>
      row.fields.forEach((field) => setValue(field.code, field.defaultValue)),
    )
    setValue(FieldsCodeFB.FB_PT, 0)
    Object.entries(_defaultValues).forEach(([key, value]) =>
      setValue(key, value),
    )
  }, [])

  useEffect(() => {
    const suma = Object.values(RowsCodeFB).reduce(
      (accumulator, code) =>
        accumulator +
        (getValues(`foliculos_${FoliculosType.BARBA}_${code}_cantidad`) || 0),
      0,
    )
    setValue(FieldsCodeFB.FB_PT, suma)
  }, [ld, li, cd, ci, b, m, mm, pd, pi])

  return (
    <>
      <InputNumberValid
        handleForm={handleForm}
        name={FieldsCodeFB.FB_ODP}
        label='Objetivo de densidad promedio'
        mode={InputNumberMode.DECIMAL}
        min={0}
        suffix=' cm²'
        disabled={disabledData}
        required
        onCustomChange={(e) => {
          const currentValue = e.value || 0
          Object.values(RowsCodeFB).forEach((code) => {
            const resta =
              currentValue -
              (getValues(`foliculos_${FoliculosType.BARBA}_${code}_de`) || 0)
            setValue(
              `foliculos_${FoliculosType.BARBA}_${code}_dr`,
              resta >= 0 ? resta : 0,
            )
          })
          Object.values(RowsCodeFB).forEach((code) =>
            calcNoFoliculos(code, FoliculosType.BARBA, handleForm),
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
              rows={barbaRows}
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
                  name={FieldsCodeFB.FB_PT}
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
        name={FieldsCodeFB.FB_OBS}
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

export default FoliculosBarbaTable
