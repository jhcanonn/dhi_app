'use client'

import { ReactNode, useState } from 'react'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { MAX_MB_GALLERY, PATIENT_FILES } from '@utils'
import { DirectusTag, TagType } from '@models'
import { UpdatingFilesProgress } from '@components/molecules'
import FilesTable from './FilesTable'
import { classNames as cx } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import {
  useClientInfo,
  useDirectusFiles,
  usePatchPatient,
  useTags,
  withToast,
} from '@hooks'

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const MenuFiles = ({ showSuccess, showError }: Props) => {
  const [selectedTag, setSelectedTag] = useState<DirectusTag | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const { tags } = useTags(TagType.FILE)
  const { uploadFile } = useDirectusFiles()
  const { createFile } = usePatchPatient()
  const { refreshClientInfo } = useClientInfo()

  const uploadFileToDirectus = async (file: File) => {
    try {
      const res = await uploadFile(file, PATIENT_FILES)
      if (selectedTag && res?.id) {
        const createdFile = await createFile(selectedTag, res.id)
        createdFile && (await refreshClientInfo())
      }
      showSuccess(
        'Carga exitosa!',
        `Archivo ${res.filename_download} cargado exitosamente.`,
      )
    } catch (error: any) {
      showError(
        'Error en la carga',
        `No se pudo cargar el archivo ${file.name}. ${error.message}`,
      )
    }
  }

  const uploadHandler = async (event: FileUploadHandlerEvent) => {
    setUploadLoading(true)
    uploadFileToDirectus(event.files[0]).then(() => {
      event.options.clear()
      setSelectedTag(null)
      setUploadLoading(false)
    })
  }

  return (
    <section className='flex flex-col gap-[0.3rem]'>
      <div className='!grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center min-h-[78px] md:min-h-[38px]'>
        <span className='p-float-label w-full col-span-1 lg:col-span-3'>
          <Dropdown
            inputId='fileTagInput'
            options={tags}
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.value ?? null)}
            optionLabel='nombre'
            filter
            showClear
          />
          <label htmlFor='fileTagInput'>Etiqueta</label>
        </span>
        <FileUpload
          mode='basic'
          name='demo[]'
          url='/api/upload'
          accept='application/*'
          maxFileSize={MAX_MB_GALLERY * 1000000}
          auto
          customUpload
          uploadHandler={uploadHandler}
          disabled={selectedTag === null}
          chooseLabel='Cargar archivo'
          className={cx(
            '[&_.p-fileupload-choose]:w-full text-sm [&_.p-fileupload-choose]:py-[5.5px]',
            { 'cursor-not-allowed': selectedTag === null },
          )}
        />
      </div>
      <div className='h-[25px]'>
        {uploadLoading && (
          <UpdatingFilesProgress message='Actualizando archivos...' />
        )}
      </div>
      <FilesTable onUploadLoading={(loading) => setUploadLoading(loading)} />
    </section>
  )
}

export default withToast(MenuFiles)
