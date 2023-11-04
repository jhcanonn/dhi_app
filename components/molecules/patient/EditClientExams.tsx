'use client'

import {
  IClientExamsPrescriptionType,
  IExams,
  ITemplatesExamsPrescriptionType,
} from '@components/organisms/patient/ExamsPrescriptionTable'
import { Fieldset } from 'primereact/fieldset'
import { DataScroller } from 'primereact/datascroller'
import { Checkbox } from 'primereact/checkbox'
import { ChangeEvent, useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from 'primereact/inputnumber'
import { AutoComplete } from 'primereact/autocomplete'
import {
  CREATE_MEDICAL_COMPLEMENT,
  LocalStorageTags,
  UPDATE_MEDICAL_COMPLEMENT,
} from '@utils'
import { useMutation } from '@apollo/client'

type Props = {
  data: IClientExamsPrescriptionType | ITemplatesExamsPrescriptionType
  exams: IExams[]
  fichaId: number
  isView: boolean
  isEdit: boolean
  onHide: (message: string, isError: boolean | null) => void
}

const EditClientExams = ({
  data,
  exams,
  fichaId,
  isView,
  isEdit,
  onHide,
}: Props) => {
  const [createMedicalComplement] = useMutation(CREATE_MEDICAL_COMPLEMENT)
  const [updateMedicalComplement] = useMutation(UPDATE_MEDICAL_COMPLEMENT)

  const [selectedExams, setSelectedExams] = useState<IExams[]>([])
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<any>(null)
  const [values, setValues] = useState<IExams[]>([])

  const [diagnostics, setDiagnostics] = useState([])
  const [filteredDiagnostics, setFilteredDiagnostics] = useState(null)

  useEffect(() => {
    if (data) {
      const _selectedExams = data.examenes.map((item) => item.examenes_id)
      setSelectedExams(_selectedExams)
      setSelectedDiagnostic(data.diagnostico)
      const _exams = [...exams]
      _exams.forEach((exam) => {
        const detailExamenes = data?.examenes?.find(
          (e) => e.examenes_id.id === exam.id,
        )
        exam.cantidad = detailExamenes?.cantidad ?? 1
        exam.descripcion = detailExamenes?.descripcion
      })
      setValues(_exams)
    }
  }, [data])

  useEffect(() => {
    if (diagnostics.length === 0) {
      const lsCie10 = window.localStorage.getItem(LocalStorageTags.CIE10)
      setDiagnostics(JSON.parse(lsCie10 ?? '[]'))
    }
  }, [diagnostics])

  const onExamChange = (e: any) => {
    let _selectedExams = [...selectedExams]
    if (e.checked) _selectedExams.push(e.value)
    else
      _selectedExams = _selectedExams.filter((exam) => exam.id !== e.value.id)
    setSelectedExams(_selectedExams)
  }

  const isCheckboxChecked = (exam: IExams) => {
    return selectedExams.some((item) => item.id === exam.id)
  }

  const search = (event: any) => {
    let _filteredDiagnostics: any

    if (!event.query.trim().length) {
      _filteredDiagnostics = [...diagnostics]
    } else {
      _filteredDiagnostics = diagnostics.filter((diagnostic: any) => {
        return diagnostic.code
          .toLowerCase()
          .startsWith(event.query.toLowerCase())
      })
      if (_filteredDiagnostics.length === 0)
        _filteredDiagnostics = diagnostics.filter((diagnostic: any) => {
          return diagnostic.descripcion
            .toLowerCase()
            .startsWith(event.query.toLowerCase())
        })
    }

    setFilteredDiagnostics(_filteredDiagnostics)
  }

  const onSaveMedicalComplement = async () => {
    try {
      let result: any
      if (!isEdit) {
        result = await createMedicalComplement({
          variables: {
            fichaId,
            tipo: 'Examen',
            cantidad: selectedExams.length,
            descripcion: data.nombre,
            examenes: selectedExams.map((item) => {
              const InputDataExam = exams.find((e) => e.id === item.id)
              return {
                cantidad: InputDataExam?.cantidad,
                descripcion: InputDataExam?.descripcion,
                examenes_id: { id: item.id },
              }
            }),
            diagnostico: selectedDiagnostic
              ? { code: selectedDiagnostic.code }
              : null,
          },
        })
      } else {
        result = await updateMedicalComplement({
          variables: {
            id: data.id,
            cantidad: selectedExams.length,
            descripcion: data.nombre,
            examenes: selectedExams.map((item) => {
              const InputDataExam = exams.find((e) => e.id === item.id)
              const detailExamenes = data.examenes.find(
                (e) => e.examenes_id.id === item.id,
              )
              return {
                id: detailExamenes?.id ?? undefined,
                cantidad: InputDataExam?.cantidad,
                descripcion: InputDataExam?.descripcion,
                examenes_id: { id: item.id },
              }
            }),
            diagnostico: selectedDiagnostic
              ? { code: selectedDiagnostic.code }
              : null,
          },
        })
      }
      const dataMedicalComplement: IClientExamsPrescriptionType =
        result.data.create_complementos_medicos_item
      console.log(dataMedicalComplement)
      onHide('Correcto', false)
    } catch (error: any) {
      onHide(error.message, true)
    }
  }

  const idItemTemplate = (item: any) => (
    <p className='text-[0.8rem]'>
      {item.code} - {item.descripcion}
    </p>
  )

  const seletedItemTemplate = (item: any) =>
    `${item.code} - ${item.descripcion}`

  const changeCantidad = (e: InputNumberValueChangeEvent, exam: IExams) => {
    exam.cantidad = Number(e?.target?.value ?? 1)
  }

  const changeDescripcion = (
    e: ChangeEvent<HTMLInputElement>,
    exam: IExams,
  ) => {
    exam.descripcion = e?.target?.value ?? ''
  }

  const itemTemplate = (rowData: IExams) => {
    return (
      <div className='grid lg:flex '>
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
        <div className='col-1'>
          <div className='flex flex-row gap-1'>
            <div className='pt-3'>{rowData.codigo}</div>
          </div>
        </div>
        <div className='col-3'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2'>
              <span className='p-float-label'>
                <InputNumber
                  id='quantyInput'
                  className='p-inputtext-sm'
                  value={rowData.cantidad}
                  onValueChange={(e) => changeCantidad(e, rowData)}
                  minFractionDigits={0}
                  disabled={isView || !isCheckboxChecked(rowData)}
                  showButtons
                  buttonLayout='horizontal'
                  min={1}
                  decrementButtonClassName='p-button-danger p-button-outlined'
                  incrementButtonClassName='p-button-success p-button-outlined'
                  incrementButtonIcon='pi pi-plus'
                  decrementButtonIcon='pi pi-minus'
                />
                <label htmlFor='quantyInput'>Cantidad</label>
              </span>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2  w-full'>
              <span className='p-float-label'>
                <InputText
                  id='descriptionInput'
                  className='p-inputtext-sm w-full'
                  value={rowData.descripcion}
                  onChange={(e) => changeDescripcion(e, rowData)}
                  disabled={isView || !isCheckboxChecked(rowData)}
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
    <div className='flex flex-col md:flex-row gap-2 justify-center'>
      <Button
        label='Cerrar'
        severity='danger'
        type='button'
        onClick={() => onHide('', null)}
        className='w-full md:w-fit'
      />
      <Button
        label='Guardar'
        severity='success'
        type='button'
        onClick={() => onSaveMedicalComplement()}
        className='w-full md:w-fit'
        visible={!isView}
      />
    </div>
  )

  return (
    <>
      <div>
        <span className='p-float-label pb-3'>
          <AutoComplete
            inputId='acdiagnostic'
            field='code'
            value={selectedDiagnostic}
            suggestions={filteredDiagnostics!}
            completeMethod={search}
            itemTemplate={idItemTemplate}
            selectedItemTemplate={seletedItemTemplate}
            onChange={(e) => setSelectedDiagnostic(e.value)}
            virtualScrollerOptions={{ itemSize: 38 }}
            disabled={isView}
          />
          <label htmlFor='acdiagnostic'>Diagnostico</label>
        </span>

        <Fieldset legend={data.nombre}>
          <div className='!grid grid-cols-1  w-full gap-x-4 m-0'>
            <DataScroller
              value={values}
              itemTemplate={itemTemplate}
              rows={1000}
              inline
              scrollHeight='500px'
              header='Selecciona los exámenes a realizar'
              footer={footer}
            />
          </div>
        </Fieldset>
      </div>
      <br></br>
    </>
  )
}

export default EditClientExams
