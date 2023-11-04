'use client'

import GalleryTable from './GalleryTable'
import { ReactNode, useEffect, useState } from 'react'
import { MAX_MB_GALLERY, PATIENT_GALLERY } from '@utils'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { DirectusTag, TagType } from '@models'
import { UUID } from 'crypto'
import { UpdatingFilesProgress } from '@components/molecules'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { classNames as cx } from 'primereact/utils'
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

const MenuImages = ({ showSuccess, showError }: Props) => {
  const [fileIds, setFileIds] = useState<UUID[]>([])
  const [selectedTags, setSelectedTags] = useState<DirectusTag[]>([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const { createGalleryPhotos } = usePatchPatient()
  const { uploadFile } = useDirectusFiles()
  const { refreshClientInfo } = useClientInfo()
  const { tags } = useTags(TagType.IMAGE)

  const uploadFileToDirectus = async (file: File) => {
    try {
      const res = await uploadFile(file, PATIENT_GALLERY)
      if (res?.id) setFileIds((prevFile) => [...prevFile, res.id as UUID])
      showSuccess(
        'Carga exitosa!',
        `Imagen ${res.filename_download} cargada exitosamente.`,
      )
    } catch (error: any) {
      showError(
        'Error en la carga',
        `No se pudo cargar la imagen ${file.name}. ${error.message}`,
      )
    }
  }

  const uploadHandler = async (event: FileUploadHandlerEvent) => {
    setUploadLoading(true)
    setFileIds([])
    const uploadFiles = event.files.map(async (file: File) => {
      await uploadFileToDirectus(file)
    })
    Promise.all(uploadFiles).then(() => {
      event.options.clear()
      setUploadLoading(false)
    })
  }

  const createGallery = async (tags: DirectusTag[], fileIds: UUID[]) => {
    const createdGallery = await createGalleryPhotos(tags, fileIds)
    if (createdGallery) {
      await refreshClientInfo()
      setSelectedTags([])
    }
  }

  useEffect(() => {
    if (!uploadLoading && fileIds.length > 0)
      createGallery(selectedTags, fileIds)
  }, [uploadLoading])

  return (
    <section className='flex flex-col gap-[0.3rem]'>
      <div className='!grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center min-h-[78px] md:min-h-[38px]'>
        <span className='p-float-label w-full col-span-1 lg:col-span-3'>
          <MultiSelect
            inputId='imagesTagInput'
            options={tags}
            value={selectedTags}
            onChange={(e: MultiSelectChangeEvent) => setSelectedTags(e.value)}
            display='chip'
            optionLabel='nombre'
            placeholder='Seleccione etiquetas'
            className='w-full col-span-1 lg:col-span-3'
            filter
          />
          <label htmlFor='imagesTagInput' className='images-tags'>
            Etiqueta(s)
          </label>
        </span>
        <FileUpload
          mode='basic'
          name='demo[]'
          url='/api/upload'
          accept='image/*'
          maxFileSize={MAX_MB_GALLERY * 1000000}
          auto
          multiple
          customUpload
          uploadHandler={uploadHandler}
          disabled={selectedTags.length === 0}
          chooseLabel='Cargar set de imagenes'
          className={cx(
            '[&_.p-fileupload-choose]:w-full text-sm [&_.p-fileupload-choose]:py-[5.5px]',
            { 'cursor-not-allowed': selectedTags.length === 0 },
          )}
        />
      </div>
      <div className='h-[25px]'>
        {uploadLoading && (
          <UpdatingFilesProgress message='Cargando imagen(es)...' />
        )}
      </div>
      <GalleryTable />
    </section>
  )
}

export default withToast(MenuImages)
