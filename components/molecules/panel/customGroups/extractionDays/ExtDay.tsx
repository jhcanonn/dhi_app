'use client'

import {
  DateTimeValid,
  InputNumberValid,
  InputTextareaValid,
} from '@components/atoms'
import { InputNumberMode } from '@components/atoms/InputNumberValid'
import { Divider } from 'primereact/divider'
import { UseFormReturn } from 'react-hook-form'
import {
  FieldsCodeED,
  GRAFT_QUANTITY,
  calcTotalED,
  graftFields,
} from './dataED'
import { useEffect } from 'react'
import { HC_IMPLANTE_CODE, regexPatterns } from '@utils'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
  day?: number
  isTotal?: boolean
}

const ExtDay = ({ handleForm, disabledData, day = 1, isTotal }: Props) => {
  const { setValue, getValues, clearErrors, watch } = handleForm
  const endCode = isTotal ? '_total' : `_dia${day}`
  const totalCode = isTotal ? '' : endCode
  const regex = new RegExp(`^${HC_IMPLANTE_CODE}.*dia${day}$`)

  useEffect(() => {
    if (watch('firma_hora_de_cierre')) {
      Object.entries(getValues())
        .filter(([key]) => key.match(regex))
        .forEach(([key, value]) => setValue(key, value))
    } else {
      graftFields.forEach((field) =>
        setValue(`${field.code}${endCode}`, isTotal ? 0 : field.defaultValue),
      )
      setValue(`${FieldsCodeED.ED_GT}${totalCode}`, 0)
      setValue(`${FieldsCodeED.ED_GFT}${totalCode}`, 0)
      setValue(`${FieldsCodeED.ED_R}${endCode}`, undefined)
      if (!isTotal) {
        setValue(`${FieldsCodeED.ED_FI}${endCode}`, null)
        setValue(`${FieldsCodeED.ED_FF}${endCode}`, null)
        setValue(`${FieldsCodeED.ED_SV}${endCode}`, '')
      }
    }

    return () => {
      Object.keys(getValues())
        .filter((k) => k.match(regex))
        .forEach((k) => {
          setValue(k, undefined)
          clearErrors(k)
        })

      for (let i = 1; i <= GRAFT_QUANTITY; i++) {
        calcTotalED(handleForm, FieldsCodeED.ED_G, i)
        calcTotalED(handleForm, FieldsCodeED.ED_GF, i)
        calcTotalED(handleForm, FieldsCodeED.ED_GT, i, true)
        calcTotalED(handleForm, FieldsCodeED.ED_GFT, i, true)
      }
    }
  }, [])

  return (
    <article className='w-full min-w-fit mx-1'>
      <Divider
        align='center'
        className='[&_.p-divider-content]:bg-transparent mt-0'
      >
        <h2 className='text-xl font-extrabold text-brand bg-white px-2'>
          {isTotal ? 'Total' : `Día ${day}`}
        </h2>
      </Divider>
      <section className='!grid grid-cols-2 gap-x-2 gap-y-1'>
        {graftFields.map((field) => {
          return (
            <InputNumberValid
              key={`${field.code}${endCode}`}
              name={`${field.code}${endCode}`}
              handleForm={handleForm}
              label={field.label}
              mode={field.mode ?? InputNumberMode.DECIMAL}
              min={0}
              disabled={field.disabled || isTotal || disabledData}
              required
              onCustomChange={(e) =>
                field.onCustomChange && field.onCustomChange(e, handleForm, day)
              }
            />
          )
        })}
        <InputNumberValid
          name={`${FieldsCodeED.ED_GT}${totalCode}`}
          handleForm={handleForm}
          label='Total Graft'
          mode={InputNumberMode.DECIMAL}
          min={0}
          disabled
          required
        />
        <InputNumberValid
          name={`${FieldsCodeED.ED_GFT}${totalCode}`}
          handleForm={handleForm}
          label='Total Foliculos'
          mode={InputNumberMode.DECIMAL}
          min={0}
          disabled
          required
        />
        <InputNumberValid
          name={`${FieldsCodeED.ED_R}${endCode}`}
          handleForm={handleForm}
          label={`Radio ${isTotal ? 'total' : `día ${day}`}`}
          mode={InputNumberMode.DECIMAL}
          min={0}
          disabled={disabledData}
          required
          className='col-span-2'
        />
        {!isTotal && (
          <>
            <DateTimeValid
              name={`${FieldsCodeED.ED_FI}${endCode}`}
              handleForm={handleForm}
              label='Fecha de inicio'
              disabled={disabledData}
              required
              stepMinute={1}
              className='col-span-2'
            />
            <DateTimeValid
              name={`${FieldsCodeED.ED_FF}${endCode}`}
              handleForm={handleForm}
              label='Fecha de fin'
              disabled={disabledData}
              required
              stepMinute={1}
              className='col-span-2'
            />
            <InputTextareaValid
              name={`${FieldsCodeED.ED_SV}${endCode}`}
              handleForm={handleForm}
              label='Signos vitales - TA - FC - SO2 - Peso'
              rows={4}
              gridRows={4}
              pattern={regexPatterns.onlyEmpty}
              disabled={disabledData}
              className='col-span-2'
            />
          </>
        )}
      </section>
    </article>
  )
}

export default ExtDay