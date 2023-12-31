'use client'

import {
  IClientExamsPrescriptionType,
  IExams,
  IPrescription,
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
import { AutoComplete, AutoCompleteChangeEvent } from 'primereact/autocomplete'
import {
  CREATE_MEDICAL_COMPLEMENT,
  LocalStorageTags,
  TypesExamsPrescription,
  UPDATE_MEDICAL_COMPLEMENT,
} from '@utils'
import { useMutation } from '@apollo/client'
import { ClientDirectus } from '@models'
import { InputTextarea } from 'primereact/inputtextarea'
import { Divider } from 'primereact/divider'

type Props = {
  data: IClientExamsPrescriptionType | ITemplatesExamsPrescriptionType
  clientInfo: ClientDirectus | null
  config: {
    tipo: string
    isView: boolean
    isEdit: boolean
    exams: IExams[]
    prescriptions: IPrescription[]
  }
  onHide: (
    data: IClientExamsPrescriptionType | undefined,
    message: string,
    isError: boolean | null,
  ) => void
}

interface IValuesPrescription {
  id: number
  formula?: string
  Recetas_id: IPrescription
}

const EditClientExamsPrescription = ({
  data,
  clientInfo,
  config,
  onHide,
}: Props) => {
  const [createMedicalComplement] = useMutation(CREATE_MEDICAL_COMPLEMENT)
  const [updateMedicalComplement] = useMutation(UPDATE_MEDICAL_COMPLEMENT)

  const [selectedExams, setSelectedExams] = useState<IExams[]>([])
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<{
    code: string
    descripcion: string
  }>()
  const [valuesExams, setValuesExams] = useState<IExams[]>([])
  const [valuesPrescription, setValuesPrescription] = useState<
    IValuesPrescription[]
  >([])

  const [diagnostics, setDiagnostics] = useState([])
  const [filteredDiagnostics, setFilteredDiagnostics] = useState(null)

  useEffect(() => {
    if (data) {
      const _selectedExams = data.examenes.map((item) => item.examenes_id)
      setSelectedExams(_selectedExams)
      setSelectedDiagnostic(data.diagnostico)
      const _exams = [...config.exams].map((exam: IExams) => {
        const detailExamenes = data?.examenes?.find(
          (e) => e.examenes_id.id === exam.id,
        )
        return {
          ...exam,
          cantidad: detailExamenes?.cantidad ?? 1,
          descripcion: detailExamenes?.descripcion ?? '',
        }
      })
      setValuesExams(_exams)
      if (data?.recetas) {
        const prescriptions = [...data.recetas].map((receta) => ({
          ...receta,
          formula: receta.formula ?? receta.Recetas_id.receta,
        }))
        setValuesPrescription(prescriptions)
      }
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
      if (!config.isEdit) {
        result = await createMedicalComplement({
          variables: {
            fichaId: clientInfo?.ficha_id?.id,
            tipo: config.tipo,
            cantidad:
              config.tipo === TypesExamsPrescription.EXAMEN
                ? selectedExams.length
                : 1,
            descripcion: data.nombre,
            examenes:
              config.tipo === TypesExamsPrescription.EXAMEN
                ? selectedExams.map((item) => {
                    const InputDataExam = valuesExams.find(
                      (e) => e.id === item.id,
                    )
                    return {
                      cantidad: InputDataExam?.cantidad,
                      descripcion: InputDataExam?.descripcion,
                      examenes_id: { id: item.id },
                    }
                  })
                : undefined,
            recetas:
              config.tipo === TypesExamsPrescription.RECETA
                ? valuesPrescription.map((precrip) => ({
                    formula: precrip?.formula,
                    Recetas_id: { id: precrip.Recetas_id.id },
                  }))
                : undefined,
            diagnostico: selectedDiagnostic
              ? { code: selectedDiagnostic.code }
              : undefined,
          },
        })
      } else {
        result = await updateMedicalComplement({
          variables: {
            id: data.id,
            cantidad: selectedExams.length,
            descripcion: data.nombre,
            examenes:
              config.tipo === TypesExamsPrescription.EXAMEN
                ? selectedExams.map((item) => {
                    const InputDataExam = valuesExams.find(
                      (e) => e.id === item.id,
                    )
                    const detailExamenes = data.examenes.find(
                      (e) => e.examenes_id.id === item.id,
                    )
                    return {
                      id: detailExamenes?.id ?? undefined,
                      cantidad: InputDataExam?.cantidad,
                      descripcion: InputDataExam?.descripcion,
                      examenes_id: { id: item.id },
                    }
                  })
                : undefined,
            recetas:
              config.tipo === TypesExamsPrescription.RECETA
                ? valuesPrescription.map((precrip) => ({
                    id: precrip.id,
                    formula: precrip.formula,
                    Recetas_id: { id: precrip.Recetas_id.id },
                  }))
                : undefined,

            diagnostico: selectedDiagnostic
              ? { code: selectedDiagnostic.code }
              : null,
          },
        })
      }
      const dataMedicalComplement: IClientExamsPrescriptionType =
        result.data.create_complementos_medicos_item
      onHide(dataMedicalComplement, 'Correcto', false)
    } catch (error: any) {
      onHide(undefined, error.message, true)
    }
  }

  const idItemTemplate = (item: any) => (
    <div className='flex align-items-center'>
      <p className='text-[0.8rem]'>
        {item.code} - {item.descripcion}
      </p>
    </div>
  )

  const seletedItemTemplate = (item: any) =>
    `${item.code} - ${item.descripcion}`

  const changeCantidad = (e: InputNumberValueChangeEvent, exam: IExams) => {
    const _exams = valuesExams.map((examMap: IExams) => {
      return {
        ...examMap,
        cantidad:
          examMap.id == exam.id
            ? Number(e?.target?.value ?? 1)
            : examMap.cantidad,
      }
    })
    setValuesExams(_exams)
  }

  const changeDescripcion = (
    e: ChangeEvent<HTMLInputElement>,
    exam: IExams,
  ) => {
    const _exams = valuesExams.map((examMap: IExams) => {
      return {
        ...examMap,
        descripcion:
          examMap.id == exam.id ? e?.target?.value ?? '' : examMap.descripcion,
      }
    })
    setValuesExams(_exams)
  }

  const changeReceta = (
    e: ChangeEvent<HTMLTextAreaElement>,
    prescrip: IValuesPrescription,
  ) => {
    const _valuesPrescription = valuesPrescription.map(
      (item: IValuesPrescription) => {
        return {
          ...item,
          formula:
            item.id === prescrip.id ? e?.target?.value ?? '' : item.formula,
        }
      },
    )
    setValuesPrescription(_valuesPrescription)
  }

  const itemTemplate = (rowData: IExams) => {
    return (
      <div className='!grid grid-cols-1 md:grid-cols-7 gap-x-0 md:gap-x-4 gap-y-2 mt-2 mb-4 md:mb-2'>
        <div
          className='col-span-1 md:col-span-2 flex flex-col justify-center'
          style={{ cursor: 'pointer' }}
          onClick={() => {
            document.getElementById(rowData.id.toString())?.click()
          }}
        >
          <div className='flex flex-row gap-1'>
            <div className='w-full'>
              <Checkbox
                inputId={rowData.id.toString()}
                name='exams'
                value={rowData}
                onChange={onExamChange}
                checked={isCheckboxChecked(rowData)}
                disabled={config.isView}
              />
              <label className='ml-2'>{rowData.nombre}</label>
            </div>
          </div>
        </div>
        <div className='col-span-1 flex flex-col justify-center'>
          <div className='flex flex-row gap-1'>
            <p>
              <span className='text-md md:text-sm mr-2'>Código:</span>{' '}
              {rowData.codigo}
            </p>
          </div>
        </div>
        <div className='col-span-1 md:col-span-2 lg:col-span-1'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2 w-full'>
              <span className='p-float-label'>
                <InputNumber
                  id='quantyInput'
                  className='p-inputtext-sm [&_input]:w-full [&_input]:text-center'
                  value={rowData.cantidad}
                  onValueChange={(e) => changeCantidad(e, rowData)}
                  minFractionDigits={0}
                  disabled={config.isView || !isCheckboxChecked(rowData)}
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
        <div className='col-span-1 md:col-span-2 lg:col-span-3'>
          <div className='flex flex-row gap-1'>
            <div className='pt-2  w-full'>
              <span className='p-float-label'>
                <InputText
                  id='descriptionInput'
                  className='p-inputtext-sm w-full'
                  value={rowData.descripcion}
                  onChange={(e) => changeDescripcion(e, rowData)}
                  disabled={config.isView || !isCheckboxChecked(rowData)}
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
        icon='pi pi-times'
        label='Cerrar'
        severity='danger'
        type='button'
        onClick={() => onHide(undefined, '', null)}
        className='w-full md:w-fit'
      />
      <Button
        icon='pi pi-save'
        label='Guardar'
        severity='success'
        type='button'
        onClick={() => onSaveMedicalComplement()}
        className='w-full md:w-fit'
        visible={!config.isView}
      />
    </div>
  )

  return config.tipo === TypesExamsPrescription.EXAMEN ? (
    <>
      <div>
        <Fieldset legend={data.nombre}>
          <span className='p-float-label'>
            <AutoComplete
              inputId='acdiagnostic'
              field='code'
              value={selectedDiagnostic}
              suggestions={filteredDiagnostics!}
              completeMethod={search}
              itemTemplate={idItemTemplate}
              selectedItemTemplate={seletedItemTemplate}
              onChange={(e: AutoCompleteChangeEvent) => {
                e.originalEvent?.nativeEvent?.type === 'focusout' &&
                typeof selectedDiagnostic === 'object'
                  ? setSelectedDiagnostic(e.value ?? selectedDiagnostic)
                  : setSelectedDiagnostic(e.value)
              }}
              virtualScrollerOptions={{ itemSize: 38 }}
              disabled={config.isView}
              forceSelection={true}
            />
            <label htmlFor='acdiagnostic'>Diagnostico</label>
          </span>
          <Divider
            align='center'
            className='[&_.p-divider-content]:bg-transparent mt-4 mb-3'
          />
          <div className='!grid grid-cols-1  w-full gap-x-4 m-0'>
            <DataScroller
              value={valuesExams}
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
  ) : (
    valuesPrescription.map((prescription) => (
      <Fieldset key={`prescription_${prescription.id}`} legend={data.nombre}>
        <div className='!grid grid-cols-1 w-full gap-x-4 m-0'>
          <InputTextarea
            rows={20}
            readOnly={config.isView}
            value={prescription.formula}
            onChange={(e) => changeReceta(e, prescription)}
          />
          <Divider
            align='center'
            className='[&_.p-divider-content]:bg-transparent mt-4 mb-3'
          />
          {footer}
        </div>
      </Fieldset>
    ))
  )
}

export default EditClientExamsPrescription
