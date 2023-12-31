'use client'

import { useClientContext } from '@contexts'
import { DataTable } from 'primereact/datatable'
import { ReactNode, useState, useEffect } from 'react'
import {
  ANULLED_MEDICAL_COMPLEMENT,
  GET_TEMPLATES_RECIPES_EXAMS_BY_FICHAID,
  TypesExamsPrescription,
  clientInfoToHeaderDataPDFMapper,
  getFormatedDateToEs,
} from '@utils'
import { Column } from 'primereact/column'
import { useMutation, useQuery } from '@apollo/client'
import { UUID } from 'crypto'
import { Button } from 'primereact/button'
import { PrimeIcons } from 'primereact/api'
import { Dropdown } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { ProgressSpinner } from 'primereact/progressspinner'
import { withToast } from '@hooks'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { StatusComplementMedical } from '@models'
import { Tag } from 'primereact/tag'
import { Divider } from 'primereact/divider'
import { EditClientExamsPrescription } from '@components/molecules'
import { generateExamnToPDF, generatePrescriptionToPDF } from '@utils/utils-pdf'

export interface IDHIDataExams {
  complementos_medicos: IClientExamsPrescriptionType[]
  plantillas: ITemplatesExamsPrescriptionType[]
  examenes: IExams[]
  Recetas: IPrescription[]
}

export interface IExams {
  id: number
  orden: number
  nombre: string
  codigo: string
  cantidad: number
  descripcion: string | undefined
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
    cantidad?: number
    descripcion?: string
  }[]
  recetas: {
    id: number
    formula?: string
    Recetas_id: IPrescription
  }[]
  diagnostico: {
    code: string
    descripcion: string
  }
}

export interface IExamenType {
  id: number
  examenes_id: IExams
  cantidad: number
  descripcion: string
}

export interface IRecetaType {
  id: number
  formula: string
  Recetas_id: IPrescription
}

export interface IClientExamsPrescriptionType {
  id: number
  estado: string
  orden: number
  tipo: string
  nombre: string
  diagnostico: {
    code: string
    descripcion: string
  }
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
  examenes: IExamenType[]
  recetas: IRecetaType[]
}

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const ExamsPrescriptionTable = ({ showSuccess, showError }: Props) => {
  const [anulledMedicalComplement] = useMutation(ANULLED_MEDICAL_COMPLEMENT)

  const { clientInfo } = useClientContext()
  const fichaId = clientInfo?.ficha_id?.id

  const { data: dataRecipesExams, loading: dataRecipesExamsLoading } =
    useQuery<IDHIDataExams>(GET_TEMPLATES_RECIPES_EXAMS_BY_FICHAID, {
      variables: { fichaId: fichaId ?? 0 },
    })

  const [selectedTemplateExamns, setSelectedTemplateExamns] =
    useState<ITemplatesExamsPrescriptionType | null>()

  const [selectedTemplatePrescription, setTelectedTemplatePrescription] =
    useState<ITemplatesExamsPrescriptionType | null>()

  const [visible, setVisible] = useState<boolean>(false)
  const [currentRowData, setCurrentRowData] = useState<
    ITemplatesExamsPrescriptionType | IClientExamsPrescriptionType | null
  >(null)

  const [medicalSupplements, setMedicalSupplements] = useState<
    IClientExamsPrescriptionType[]
  >([])

  const [isView, setIsView] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [tipo, setTipo] = useState<string>('')

  const dateBodyTemplate = (rowData: IClientExamsPrescriptionType) => {
    return getFormatedDateToEs(rowData.date_created, 'LL hh:mm A')
  }

  useEffect(() => {
    if (dataRecipesExams) {
      setMedicalSupplements(dataRecipesExams.complementos_medicos ?? [])
    }
  }, [dataRecipesExams])

  const confirmDelete = (
    rowData: IClientExamsPrescriptionType | ITemplatesExamsPrescriptionType,
    tagKey: string,
  ) => {
    confirmDialog({
      tagKey,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: `Quieres anular ${rowData.tipo} ?`,
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      draggable: false,
      async accept() {
        await anulledMedicalComplement({
          variables: {
            id: rowData.id,
          },
        })
        rowData.estado = StatusComplementMedical.ANNULLED
      },
    })
  }

  const generatePDF = (rowData: IClientExamsPrescriptionType) => {
    const profesional = rowData?.user_created?.profesional
    if (rowData.tipo === TypesExamsPrescription.EXAMEN) {
      generateExamnToPDF(
        rowData.examenes,
        rowData.diagnostico,
        false,
        clientInfoToHeaderDataPDFMapper(
          clientInfo as any,
          {
            professional: profesional?.nombre,
            professionalDocument: profesional?.identificacion,
            profesionalFirma: profesional?.firma,
          } as any,
        ),
      )
    }

    if (rowData.tipo === TypesExamsPrescription.RECETA) {
      generatePrescriptionToPDF(
        rowData.recetas,
        false,
        clientInfoToHeaderDataPDFMapper(
          clientInfo as any,
          {
            professional: profesional?.nombre,
            professionalDocument: profesional?.identificacion,
            profesionalFirma: profesional?.firma,
          } as any,
        ),
      )
    }
  }

  //rowData: ExamsPrescriptionType
  const actionsBodyTemplate = (
    rowData: IClientExamsPrescriptionType | ITemplatesExamsPrescriptionType,
  ) => {
    const tagKey = `tag_key_${rowData.id}`
    return (
      <div key={tagKey}>
        <ConfirmDialog tagKey={tagKey} />
        <div className='w-full flex gap-2'>
          <Button
            className='text-sm'
            icon={PrimeIcons.EYE}
            type='button'
            outlined
            tooltip='Ver'
            tooltipOptions={{ position: 'bottom' }}
            severity='help'
            onClick={() => {
              setTipo(rowData.tipo)
              setCurrentRowData(rowData)
              setIsView(true)
              setIsEdit(false)
              setVisible(true)
            }}
          />
          {rowData.estado === StatusComplementMedical.ANNULLED ? (
            <Tag
              severity='danger'
              value='Anulada'
              className='h-fit px-2 py-1 self-center'
              rounded
            />
          ) : (
            <>
              <Button
                className='text-sm'
                icon={PrimeIcons.PENCIL}
                type='button'
                outlined
                severity='success'
                tooltip='Editar'
                onClick={() => {
                  setTipo(rowData.tipo)
                  setCurrentRowData(rowData)
                  setIsView(false)
                  setIsEdit(true)
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
                onClick={() => confirmDelete(rowData, tagKey)}
                tooltipOptions={{ position: 'bottom' }}
              />
              <Button
                className='text-sm'
                icon={PrimeIcons.PRINT}
                type='button'
                severity='info'
                tooltip='Imprimir'
                tooltipOptions={{ position: 'bottom' }}
                outlined
                onClick={() => {
                  generatePDF(rowData as any)
                }}
              ></Button>
            </>
          )}
        </div>
      </div>
    )
  }

  const headerDialog = (
    <h2>
      Solicitud de{' '}
      {tipo === TypesExamsPrescription.EXAMEN ? 'examenes' : 'receta'}
    </h2>
  )
  return (
    <div className='w-full max-w-[100rem] mx-auto px-4'>
      <div className='py-3 flex flex-col md:flex-row gap-2'>
        <Dialog
          header={headerDialog}
          draggable={false}
          visible={visible}
          onHide={() => {
            setVisible(false)
            setSelectedTemplateExamns(null)
            setTelectedTemplatePrescription(null)
          }}
          className='w-[90vw] max-w-[100rem]'
        >
          {currentRowData ? (
            <EditClientExamsPrescription
              data={currentRowData}
              config={{
                isView,
                isEdit,
                tipo,
                exams:
                  tipo === TypesExamsPrescription.EXAMEN
                    ? dataRecipesExams?.examenes ?? []
                    : [],
                prescriptions:
                  tipo === TypesExamsPrescription.RECETA
                    ? selectedTemplatePrescription?.recetas.map(
                        (receta) => receta.Recetas_id,
                      ) ?? []
                    : [],
              }}
              clientInfo={clientInfo!}
              onHide={(
                data: IClientExamsPrescriptionType | undefined,
                message: string,
                isError: boolean | null,
              ) => {
                setVisible(false)
                setSelectedTemplateExamns(null)
                setTelectedTemplatePrescription(null)
                if (isError === null) return
                if (isError) {
                  showError('Error', message)
                  return
                }
                if (data) {
                  setMedicalSupplements([data, ...medicalSupplements])
                  setCurrentRowData(null)
                  setIsView(true)
                  setIsEdit(false)
                }
                showSuccess('Exitoso', message)
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
              dataRecipesExams?.plantillas?.filter(
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
          className='px-4 py-0 disabled:!cursor-not-allowed disabled:!pointer-events-auto'
          icon={PrimeIcons.PLUS}
          disabled={!selectedTemplateExamns}
          onClick={() => {
            setTipo(TypesExamsPrescription.EXAMEN)
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
              dataRecipesExams?.plantillas?.filter(
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
          className='px-4 py-0 disabled:!cursor-not-allowed disabled:!pointer-events-auto'
          icon={PrimeIcons.PLUS}
          disabled={!selectedTemplatePrescription}
          onClick={() => {
            setTipo(TypesExamsPrescription.RECETA)
            setCurrentRowData(selectedTemplatePrescription ?? null)
            setIsView(false)
            setVisible(true)
          }}
        />
      </div>
      <Divider
        align='center'
        className='[&_.p-divider-content]:bg-transparent mt-0'
      ></Divider>

      <DataTable
        value={medicalSupplements}
        emptyMessage='No se encontraron resultados'
        size='small'
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '40rem' }}
        className='custom-table'
        loading={
          dataRecipesExams?.complementos_medicos === null ||
          dataRecipesExamsLoading
        }
        sortField='date_created'
        sortOrder={-1}
      >
        <Column
          sortable
          key='date_created'
          field='date_created'
          header='Fecha de emisión'
          body={dateBodyTemplate}
          style={{ width: '20%', minWidth: '10rem' }}
        />
        <Column
          sortable
          key='descripcion'
          field='descripcion'
          header='Descripción'
          style={{ width: '25%', minWidth: '15rem' }}
        />
        <Column
          sortable
          key='tipo'
          field='tipo'
          header='Tipo'
          style={{ width: '20%', minWidth: '5rem' }}
        />
        <Column
          sortable
          key='user_created.profesional.nombre'
          field='user_created.profesional.nombre'
          header='Profesional'
          style={{ width: '25%', minWidth: '10rem' }}
        />
        <Column
          key='actions'
          header='Acción'
          align={'center'}
          body={actionsBodyTemplate}
          style={{ width: '10%' }}
        />
      </DataTable>
    </div>
  )
}

export default withToast(ExamsPrescriptionTable)
