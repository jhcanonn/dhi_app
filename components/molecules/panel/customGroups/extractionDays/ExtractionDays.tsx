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
        <section className='w-full md:!w-fit flex flex-col md:flex-row gap-2 md:absolute md:right-[1rem] md:top-[-2rem] mb-4 md:mb-0'>
          <Button
            className='text-sm bg-white w-full min-w-fit'
            icon='pi pi-plus'
            label='Agregar Día'
            type='button'
            severity='success'
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
            className='text-sm bg-white w-full min-w-fit'
            icon='pi pi-minus'
            label='Eliminar Día'
            type='button'
            severity='danger'
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
