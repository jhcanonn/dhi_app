'use client'

import {
  IClientExamsPrescriptionType,
  IExams,
  ITemplatesExamsPrescriptionType,
} from '@components/organisms/patient/ExamsPrescriptionTable'
import { Fieldset } from 'primereact/fieldset'
import { DataScroller } from 'primereact/datascroller'
import { Checkbox } from 'primereact/checkbox'
import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'

type Props = {
  data: IClientExamsPrescriptionType | ITemplatesExamsPrescriptionType
  examns: IExams[]
  isView: boolean
  onHide: () => void
}

const EditClientExams = ({ data, examns, isView, onHide }: Props) => {
  /* const [updateAttention] = useMutation(UPDATE_ATTENTION)

  const updateAttentionOnTable = (attention: UpdatedAttention) => {
    const updatedDataSheets = dataSheets.map((ds) =>
      ds.id === attention.id ? { ...ds, data: attention.valores } : ds,
    )
    setDataSheets(updatedDataSheets)
    onHide()
  }*/

  const [selectedExams, setSelectedExams] = useState<IExams[]>([])

  useEffect(() => {
    if (data) {
      const _selectedExamns = data.examenes.map((item) => item.examenes_id)
      setSelectedExams(_selectedExamns)
    }
  }, [data])

  const onExamChange = (e: any) => {
    let _selectedExamns = [...selectedExams]

    if (e.checked) _selectedExamns.push(e.value)
    else
      _selectedExamns = _selectedExamns.filter((exam) => exam.id !== e.value.id)

    setSelectedExams(_selectedExamns)
  }

  const isCheckboxChecked = (exam: IExams) => {
    return selectedExams.some((item) => item.id === exam.id)
  }

  const itemTemplate = (rowData: IExams) => {
    return (
      <div className='grid flex'>
        <div
          className='col-4'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            document.getElementById(rowData.id.toString())?.click()
          }}
        >
          <div className='flex flex-row gap-1'>
            <div className='pt-3'>
              <Checkbox
                inputId={rowData.id.toString()}
                name='exams'
                value={rowData}
                onChange={onExamChange}
                checked={isCheckboxChecked(rowData)}
                disabled={isView}
              />

              <label className='ml-2'>{rowData.nombre}</label>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='flex flex-row gap-1'>
            <div className='pt-3'>{rowData.codigo}</div>
          </div>
        </div>
        <div className='col'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2'>
              <span className='p-float-label'>
                <InputNumber
                  id='quantyInput'
                  className='p-inputtext-sm'
                  value={rowData.cantidad}
                  onValueChange={(e) => (rowData.cantidad = Number(e.value))}
                  minFractionDigits={0}
                  disabled={isView}
                />
                <label htmlFor='quantyInput'>Cantidad</label>
              </span>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2'>
              <span className='p-float-label'>
                <InputText
                  id='descriptionInput'
                  className='p-inputtext-sm'
                  value={rowData.descripcion}
                  onChange={(e) => (rowData.descripcion = e.target.value)}
                  disabled={isView}
                />
                <label htmlFor='descriptionInput'>Descripción</label>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const footer = (
    <div className='flex flex-col md:flex-row gap-2 justify-end'>
      <Button
        label='Cerrar'
        severity='danger'
        onClick={() => onHide()}
        className='w-full md:w-fit'
      />
      <Button
        label='Guardar'
        severity='success'
        onClick={() => onHide()}
        className='w-full md:w-fit'
      />
    </div>
  )

  return (
    <form
      id='form_examn_prescription'
      autoComplete='off'
      className='flex flex-col gap-3 text-sm items-center [&>*]:w-full'
    >
      <Fieldset legend={data.nombre}>
        <div className='!grid grid-cols-1  w-full gap-x-4 m-0'>
          <DataScroller
            value={examns}
            itemTemplate={itemTemplate}
            rows={1000}
            inline
            scrollHeight='600px'
            header='Selecciona los exámenes a realizar'
            footer={footer}
          />
        </div>
      </Fieldset>
    </form>
  )
}

export default EditClientExams
