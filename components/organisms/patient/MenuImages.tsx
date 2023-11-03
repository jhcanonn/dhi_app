'use client'

import GalleryTable from './GalleryTable'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { ReactNode, useEffect, useState } from 'react'
import {
  GET_CLIENT_BY_ID,
  GET_TAGS,
  MAX_MB_GALLERY,
  PATIENTS_GALLERY,
} from '@utils'
import { useQuery } from '@apollo/client'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { useDirectusFiles, usePatchPatient, withToast } from '@hooks'
import { ClientDirectus, DirectusTag } from '@models'
import { UUID } from 'crypto'
import { useClientContext } from '@contexts'
import { UpdatingFilesProgress } from '@components/molecules'
import { classNames as cx } from 'primereact/utils'

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
}

const MenuImages = ({ showSuccess, showError }: Props) => {
  const [fileIds, setFileIds] = useState<UUID[]>([])
  const [tags, setTags] = useState<DirectusTag[]>([])
  const [selectedTags, setSelectedTags] = useState<DirectusTag[]>([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const { createGalleryPhotos } = usePatchPatient()
  const { uploadFile } = useDirectusFiles()
  const { data: dataTags, loading: loadingTags } = useQuery(GET_TAGS)

  const { clientInfo, setClientInfo } = useClientContext()
  const { refetch: refetchClientInfo } = useQuery(GET_CLIENT_BY_ID)

  const uploadFileToDirectus = async (file: File) => {
    try {
      const res = await uploadFile(file, PATIENTS_GALLERY)
      if (res?.id) setFileIds((prevFile) => [...prevFile, res.id as UUID])
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
      const data: any = await refetchClientInfo({ id: clientInfo?.id })
      setClientInfo(data.pacientes_by_id as ClientDirectus)
    }
  }

  useEffect(() => {
    !loadingTags && setTags(dataTags?.tags || [])
  }, [dataTags])

  useEffect(() => {
    if (!uploadLoading && fileIds.length > 0)
      createGallery(selectedTags, fileIds)
  }, [uploadLoading])

  return (
    <section className='flex flex-col gap-[0.3rem]'>
      <div className='!grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-center min-h-[78px] md:min-h-[38px]'>
        <MultiSelect
          value={selectedTags}
          onChange={(e: MultiSelectChangeEvent) => setSelectedTags(e.value)}
          options={tags}
          display='chip'
          optionLabel='nombre'
          placeholder='Seleccione etiquetas'
          className='w-full col-span-1 lg:col-span-3'
          filter
        />
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
