'use client'

import { UseFormReturn } from 'react-hook-form'
import ExtDay from './ExtDay'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import { FieldsCodeED } from './dataED'

type Props = {
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const ExtractionDays = ({ handleForm, disabledData }: Props) => {
  const [days, setDays] = useState([1])

  const {
    control: { _defaultValues },
    watch,
    setValue,
  } = handleForm

  useEffect(() => {
    Object.entries(_defaultValues).forEach(([key, value]) =>
      setValue(key, value),
    )
    const daysLength = +watch(FieldsCodeED.ED_CDE)
    daysLength &&
      setDays(Array.from({ length: daysLength }, (_, index) => index + 1))
  }, [])

  useEffect(() => {
    setValue(FieldsCodeED.ED_CDE, days.length)
  }, [days])

  return (
    <>
      {!disabledData && (
        <section className='absolute flex gap-2 right-[1rem] top-[-2rem]'>
          <Button
            className='text-sm bg-white'
            icon='pi pi-plus'
            type='button'
            severity='success'
            tooltip='Agregar Día'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() =>
              setDays((prev) => {
                const lastDay = prev[days.length - 1]
                return [...prev, lastDay + 1]
              })
            }
            outlined
          />
          <Button
            className='text-sm bg-white'
            icon='pi pi-minus'
            type='button'
            severity='danger'
            tooltip='Quitar Día'
            tooltipOptions={{ position: 'bottom' }}
            onClick={() =>
              setDays((prev) => {
                const lastDay = prev[days.length - 1]
                return lastDay !== 1 ? prev.filter((d) => d !== lastDay) : prev
              })
            }
            outlined
          />
        </section>
      )}
      <section className='flex gap-x-3 overflow-x-auto'>
        {days.map((day) => (
          <ExtDay
            key={`block_extraction_day_${day}`}
            handleForm={handleForm}
            disabledData={disabledData}
            day={day}
          />
        ))}
        <ExtDay handleForm={handleForm} disabledData={disabledData} isTotal />
      </section>
    </>
  )
}

export default ExtractionDays
