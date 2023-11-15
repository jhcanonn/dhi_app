'use client'

import { useClientContext } from '@contexts'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useState } from 'react'
import { GalleryType } from './GalleryTable'
import { Button } from 'primereact/button'
import { generateURLAssetsWithToken, getFormatedDateToEs } from '@utils'
import { PDFViewer } from '@components/atoms'
import { Dialog } from 'primereact/dialog'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useClientInfo, useDirectusFiles, usePatchPatient } from '@hooks'
import { UUID } from 'crypto'
import moment from 'moment'

type FileType = Pick<GalleryType, 'id' | 'date' | 'user'> & {
  tag: string
  fileId: UUID
  fileUrl: string
}

type Props = {
  onUploadLoading: (loading: boolean) => void
}

const dateBodyTemplate = (file: FileType) => <p>{file.date.formated}</p>

const FilesTable = ({ onUploadLoading }: Props) => {
  const [visible, setVisible] = useState<boolean>(false)
  const [files, setFiles] = useState<FileType[]>([])
  const [currentFile, setCurrentFile] = useState<FileType | null>(null)
  const { clientInfo } = useClientContext()
  const { deleteFile: deletePatientFile } = usePatchPatient()
  const { deleteFile } = useDirectusFiles()
  const { refreshClientInfo } = useClientInfo()

  const headerContent = (
    <h2>
      Etiqueta: <span className='font-normal'>{currentFile?.tag}</span>
    </h2>
  )

  const deleteDirectusFile = async (file: FileType) => {
    onUploadLoading(true)
    const deletedFile = await deletePatientFile(file.id)
    if (deletedFile) {
      await deleteFile(file.fileId)
      await refreshClientInfo()
    }
    onUploadLoading(false)
  }

  const confirmDelete = async (tagKey: string, file: FileType) =>
    confirmDialog({
      tagKey,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Está seguro de eliminar este archivo?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      draggable: false,
      async accept() {
        await deleteDirectusFile(file)
      },
    })

  const actionsBodyTemplate = (file: FileType) => {
    const tagKey = `upload_file_${file.id}`
    return (
      <>
        <ConfirmDialog tagKey={tagKey} />
        <section className='flex gap-2 justify-center'>
          <Button
            icon='pi pi-eye'
            severity='info'
            tooltip='Ver archivo'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => {
              setVisible(true)
              setCurrentFile(file)
            }}
          />
          <Button
            icon='pi pi-trash'
            severity='danger'
            tooltip='Eliminar archivo'
            tooltipOptions={{ position: 'bottom' }}
            outlined
            onClick={() => confirmDelete(tagKey, file)}
          />
        </section>
      </>
    )
  }

  useEffect(() => {
    const archivos = clientInfo?.archivos
      .filter((a) => a.directus_files_id)
      .map((a) => {
        const file = a.directus_files_id
        const userCreated = file.uploaded_by
        const user = userCreated.profesional
          ? userCreated.profesional.nombre
          : `${userCreated.first_name} ${userCreated.last_name}`

        return {
          id: a.id,
          fileId: file.id,
          date: {
            date: moment(file.uploaded_on).toDate(),
            timestamp: moment(file.uploaded_on).valueOf(),
            formated: getFormatedDateToEs(file.uploaded_on, 'ddd ll'),
          },
          user,
          tag: a.tag?.nombre,
          fileUrl: generateURLAssetsWithToken(file.id, {
            quality: '15',
            fit: 'cover',
          }),
        } as FileType
      })
    archivos && setFiles(archivos)
  }, [clientInfo])

  return (
    <>
      <Dialog
        maximizable
        draggable={false}
        visible={visible}
        onHide={() => setVisible(false)}
        header={headerContent}
        className='w-[90vw] md:w-[80vw] lg:w-[60rem] h-full [&_.p-dialog-header]:py-2 [&_.p-dialog-content]:p-0'
      >
        <PDFViewer
          file={currentFile?.fileUrl ?? '#'}
          width='100%'
          height='100%'
        />
      </Dialog>
      <DataTable
        value={files}
        emptyMessage='No se encontraron resultados'
        size='small'
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '40rem' }}
        className='custom-table'
        loading={clientInfo === null}
        removableSort
        sortField='date.timestamp'
        sortOrder={-1}
      >
        <Column
          key='date'
          field='date.timestamp'
          header='Fecha'
          body={dateBodyTemplate}
          style={{ width: '20%', minWidth: '7rem' }}
          sortable
        />
        <Column
          key='tag'
          field='tag'
          header='Etiqueta'
          style={{ width: '45%', minWidth: '25rem' }}
          sortable
        />
        <Column
          key='user'
          field='user'
          header='Usuario'
          style={{ width: '15%', minWidth: '10rem' }}
          sortable
        />
        <Column
          key='actions'
          header='Acción'
          align={'center'}
          body={actionsBodyTemplate}
          style={{ width: '20%' }}
        />
      </DataTable>
    </>
  )
}

export default FilesTable
