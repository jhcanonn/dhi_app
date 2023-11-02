'use client'

import GalleryTable from './GalleryTable'
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect'
import { ReactNode, useEffect, useState } from 'react'
import {
  GET_TAGS,
  MAX_MB_GALLERY,
  PATIENTS_GALLERY,
  refreshToken,
  uploadFileToDirectus,
} from '@utils'
import { useQuery } from '@apollo/client'
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload'
import { withToast } from '@hooks'
import { Cookies, withCookies } from 'react-cookie'
import { useClientContext } from '@contexts'

type Tag = {
  id: number
  nombre: string
  tipo: string
}

type Props = {
  showSuccess: (summary: ReactNode, detail: ReactNode) => void
  showError: (summary: ReactNode, detail: ReactNode) => void
  cookies: Cookies
}

const MenuImages = ({ showSuccess, showError, cookies }: Props) => {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [uploadLoading, setUploadLoading] = useState(false)
  const { clientInfo } = useClientContext()
  const { data: dataTags, loading: loadingTags } = useQuery(GET_TAGS)

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('folder', PATIENTS_GALLERY)
      formData.append('file', file)

      const access_token = await refreshToken(cookies)
      const res = await uploadFileToDirectus(formData, access_token)

      if (res?.id && clientInfo) {
        const patientId = clientInfo.id.toString()
        console.log({ res, patientId })
        // setGallery()
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
    const uploadFiles = event.files.map(async (file: File) => {
      await uploadFile(file)
    })
    Promise.all(uploadFiles).then(() => {
      event.options.clear()
      setUploadLoading(false)
    })
  }

  useEffect(() => {
    !loadingTags && setTags(dataTags?.tags || [])
  }, [dataTags])

  useEffect(() => {
    console.log({ uploadLoading })
  }, [uploadLoading])

  return (
    <section className='flex flex-col gap-4'>
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
          className='[&_.p-fileupload-choose]:w-full text-sm [&_.p-fileupload-choose]:py-[5.5px]'
        />
      </div>
      <GalleryTable />
    </section>
  )
}

export default withCookies(withToast(MenuImages))
