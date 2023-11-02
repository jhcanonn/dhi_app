'use client'

import { useClientContext } from '@contexts'
import { DataTable } from 'primereact/datatable'
import { ReactNode, useEffect, useState } from 'react'
import {
  GET_TEMPLATES_RECIPES_EXAMS_BY_FICHAID,
  TypesExamsPrescription,
  getFormatedDateToEs,
} from '@utils'
import { Column } from 'primereact/column'
import { useQuery } from '@apollo/client'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import EditClientExams from '@components/molecules/patient/EditClientExams'
import { withToast } from '@hooks'

export interface IExams {
  id: number
  orden: number
  nombre: string
  codigo: string
  cantidad: number
  descripcion: string
  categoria: string[]
}

export interface IPrescription {
  id: number
  nombre: string
  diagnostico: string
  receta: string
  html_receta: string
}

export interface ITemplatesExamsPrescriptionType {
  id: number
  estado: string
  orden: number
  tipo: string
  nombre: string
  cantidad: number
  descripcion: string
  examenes: {
    id: number
    examenes_id: IExams
  }[]
  recetas: {
    id: number
    Recetas_id: IPrescription
  }[]
  diagnostico: string
}

export interface IClientExamsPrescriptionType {
  id: number
  estado: string
  orden: number
  tipo: string
  nombre: string
  user_created: {
    id: number
    first_name: string
    last_name: string
    profesional: {
      nombre: string
      identificacion: string
      especialidad: string
      cargo: string
      no_registro_medico: number
      firma: {
        id: UUID
        filename_disk: string
      }
    }
  }
  date_created: string
  cantidad: number
  descripcion: string
  ficha_id: {
    id: number
  }
  examenes: {
    id: number
    examenes_id: IExams
  }[]
  recetas: {
    id: number
    Recetas_id: IPrescription
  }[]
  professional: string
}

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const ExamsPrescriptionTable = ({ showSuccess }: Props) => {
  const { clientInfo } = useClientContext()
  const fichaId = clientInfo?.ficha_id?.id

  const { data: dateRecipesExams, loading: dateRecipesExamsLoading } = useQuery(
    GET_TEMPLATES_RECIPES_EXAMS_BY_FICHAID,
    { variables: { fichaId } },
  )
  const [clientExamsPrescription, setClientExamsPrescription] = useState<
    IClientExamsPrescriptionType[]
  >([])
  const [dataTemplatesExamsPrescript, setDataTemplatesExamsPrescript] =
    useState<ITemplatesExamsPrescriptionType[]>([])

  const [dataExams, setDataExams] = useState<IExams[]>([])
  const [dataPrescription, setDataPrescription] = useState<IPrescription[]>([])

  const [selectedTemplateExamns, setSelectedTemplateExamns] =
    useState<ITemplatesExamsPrescriptionType>()

  const [selectedTemplatePrescription, setTelectedTemplatePrescription] =
    useState<ITemplatesExamsPrescriptionType>()

  const [visible, setVisible] = useState<boolean>(false)
  const [currentRowData, setCurrentRowData] =
    useState<ITemplatesExamsPrescriptionType | null>(null)

  const [isView, setIsView] = useState<boolean>(false)

  useEffect(() => {
    if (dateRecipesExams) {
      setClientExamsPrescription(dateRecipesExams.complementos_medicos || [])
      setDataTemplatesExamsPrescript(dateRecipesExams.plantillas || [])
      setDataExams(dateRecipesExams.examenes || [])
      if (dataPrescription.length === 0)
        setDataPrescription(dateRecipesExams.Recetas || [])
    }
  }, [dateRecipesExams])

  const dateBodyTemplate = (rowData: IClientExamsPrescriptionType) => {
    return getFormatedDateToEs(rowData.date_created, 'LL hh:mm A')
  }

  //rowData: ExamsPrescriptionType
  const actionsBodyTemplate = (rowData: ITemplatesExamsPrescriptionType) => (
    <div className='w-full flex gap-2'>
      <Button
        className='text-sm'
        icon={PrimeIcons.EYE}
        type='button'
        outlined
        tooltip='Ver'
        tooltipOptions={{ position: 'bottom' }}
        severity='info'
        onClick={() => {
          setCurrentRowData(rowData)
          setIsView(true)
          setVisible(true)
        }}
      />
      <Button
        className='text-sm'
        icon={PrimeIcons.USER_EDIT}
        type='button'
        outlined
        severity='success'
        tooltip='Editar'
        onClick={() => {
          setCurrentRowData(rowData)
          setIsView(false)
          setVisible(true)
        }}
        tooltipOptions={{ position: 'bottom' }}
      />
      <Button
        className='text-sm'
        icon={PrimeIcons.TRASH}
        type='button'
        outlined
        severity='danger'
        tooltip='Anular'
        tooltipOptions={{ position: 'bottom' }}
      />
    </div>
  )

  const headerDialog = <h2>Solicitud de exámenes</h2>

  return (
    <div className='w-full max-w-[100rem] mx-auto px-4'>
      <div className='py-3 flex flex-col md:flex-row gap-2'>
        <Dialog
          header={headerDialog}
          draggable={false}
          visible={visible}
          onHide={() => setVisible(false)}
          className='w-[90vw] max-w-[100rem]'
        >
          {currentRowData ? (
            <EditClientExams
              data={currentRowData}
              isView={isView}
              examns={dataExams}
              onHide={() => {
                setVisible(false)
                showSuccess(
                  'Examen actualizado',
                  'El examen fue actualizado correctamente',
                )
              }}
            />
          ) : (
            <div className='flex justify-center py-4'>
              <ProgressSpinner />
            </div>
          )}
        </Dialog>

        <span className='p-float-label lg:w-5 md:w-5 w-full'>
          <Dropdown
            inputId='examsInput'
            value={selectedTemplateExamns}
            onChange={(e) => setSelectedTemplateExamns(e.value)}
            options={
              dataTemplatesExamsPrescript.filter(
                (item) => item.tipo === TypesExamsPrescription.EXAMEN,
              ) ?? []
            }
            optionLabel='nombre'
            filter
            className='lg:!min-w-[24rem] md:!min-w-[10rem] w-full'
            showClear
          />
          <label htmlFor='examsInput'>Examen</label>
        </span>

        <Button
          label={'Agregar'}
          className='px-4 py-0'
          icon={PrimeIcons.PLUS}
          disabled={!selectedTemplateExamns}
          onClick={() => {
            setCurrentRowData(selectedTemplateExamns ?? null)
            setIsView(false)
            setVisible(true)
          }}
        />

        <span className='p-float-label lg:w-5 md:w-5 w-full'>
          <Dropdown
            inputId='prescripInput'
            value={selectedTemplatePrescription}
            onChange={(e) => setTelectedTemplatePrescription(e.value)}
            options={
              dataTemplatesExamsPrescript.filter(
                (item) => item.tipo === TypesExamsPrescription.RECETA,
              ) ?? []
            }
            optionLabel='nombre'
            filter
            className='lg:!min-w-[24rem] md:!min-w-[10rem] w-full'
            showClear
          />
          <label htmlFor='prescripInput'>Receta</label>
        </span>

        <Button
          label={'Agregar'}
          className='px-4 py-0'
          icon={PrimeIcons.PLUS}
          disabled={!selectedTemplatePrescription}
        />
      </div>

      <DataTable
        value={clientExamsPrescription}
        emptyMessage='No se encontraron resultados'
        size='small'
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '40rem' }}
        className='custom-table'
        loading={clientInfo === null || dateRecipesExamsLoading}
      >
        <Column
          key='tipo'
          field='tipo'
          header='Tipo'
          style={{ width: '20%' }}
        />
        <Column
          key='date_created'
          field='date_created'
          header='Fecha de emisión'
          body={dateBodyTemplate}
          style={{ width: '30%' }}
        />

        <Column
          key='user_created.profesional.nombre'
          field='user_created.profesional.nombre'
          header='Profesional'
          style={{ width: '40%' }}
        />
        <Column
          key='actions'
          header='Acción'
          body={actionsBodyTemplate}
          style={{ width: '10%' }}
        />
      </DataTable>
    </div>
  )
}

export default withToast(ExamsPrescriptionTable)
