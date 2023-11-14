'use client'

import { InputNumberValid, InputTextareaValid } from '@components/atoms'
import { regexPatterns } from '@utils'
import { UseFormReturn, useWatch } from 'react-hook-form'
import { FieldsCodeFC, RowsCodeFC, capilarRows } from './dataFCT'
import {
  FoliculosType,
  TdTitle,
  TrFoliculos,
  calcNoFoliculos,
} from '../FoliculosCommon'
import { useEffect } from 'react'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const FoliculosCapilarTable = ({ handleForm, disabledData }: Props) => {
  const { control, setValue, getValues } = handleForm
  const { _defaultValues } = control

  const za = useWatch({ control, name: FieldsCodeFC.FC_ZA_C })
  const zb = useWatch({ control, name: FieldsCodeFC.FC_ZB_C })
  const zc = useWatch({ control, name: FieldsCodeFC.FC_ZC_C })
  const lf = useWatch({ control, name: FieldsCodeFC.FC_LF_C })
  const ed = useWatch({ control, name: FieldsCodeFC.FC_ED_C })
  const ei = useWatch({ control, name: FieldsCodeFC.FC_EI_C })
  const ld = useWatch({ control, name: FieldsCodeFC.FC_LD_C })
  const li = useWatch({ control, name: FieldsCodeFC.FC_LI_C })

  useEffect(() => {
    capilarRows.forEach((row) =>
      row.fields.forEach((field) => setValue(field.code, field.defaultValue)),
    )
    setValue(FieldsCodeFC.FC_PT, 0)
    Object.entries(_defaultValues).forEach(([key, value]) =>
      setValue(key, value),
    )
  }, [])

  useEffect(() => {
    const suma = Object.values(RowsCodeFC).reduce(
      (accumulator, code) =>
        accumulator +
        (getValues(`foliculos_${FoliculosType.CAPILAR}_${code}_cantidad`) || 0),
      0,
    )
    setValue(FieldsCodeFC.FC_PT, suma)
  }, [za, zb, zc, lf, ed, ei, ld, li])

  return (
    <>
      <InputNumberValid
        handleForm={handleForm}
        name={FieldsCodeFC.FC_ODP}
        label='Objetivo de densidad promedio'
        min={0}
        disabled={disabledData}
        required
        onCustomChange={(e) => {
          const currentValue = e.value || 0
          Object.values(RowsCodeFC).forEach((code) => {
            const resta =
              currentValue -
              (getValues(`foliculos_${FoliculosType.CAPILAR}_${code}_de`) || 0)
            setValue(
              `foliculos_${FoliculosType.CAPILAR}_${code}_dr`,
              resta >= 0 ? resta : 0,
            )
          })
          Object.values(RowsCodeFC).forEach((code) =>
            calcNoFoliculos(code, FoliculosType.CAPILAR, handleForm),
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
              rows={capilarRows}
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
                  name={FieldsCodeFC.FC_PT}
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
        name={FieldsCodeFC.FC_OBS}
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

export default FoliculosCapilarTable
