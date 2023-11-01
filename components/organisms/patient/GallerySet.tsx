'use client'

import { generateURLAssetsWithToken } from '@utils/url-access-token'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria'
import { useEffect, useRef, useState } from 'react'
import { GalleryType } from './GalleryTable'
import { UUID } from 'crypto'
import { useClientContext } from '@contexts'
import { ClientPhoto, PatientGallery } from '@models'
import { deleteFileToDirectus, patchPatient, refreshToken } from '@utils'
import { Cookies, withCookies } from 'react-cookie'

type Image = {
  id: number
  fileId: UUID
  itemImageSrc: string
  thumbnailImageSrc: string
  alt: string
  title: string
  tags: string
}

const maxVisible = 13
const responsiveOptions: GalleriaResponsiveOptions[] = [
  {
    breakpoint: '1536px',
    numVisible: maxVisible,
  },
  {
    breakpoint: '1280px',
    numVisible: 10,
  },
  {
    breakpoint: '1024px',
    numVisible: 7,
  },
  {
    breakpoint: '768px',
    numVisible: 4,
  },
  {
    breakpoint: '560px',
    numVisible: 2,
  },
]

const thumbnailTemplate = (item: Image) => (
  <img
    src={item.thumbnailImageSrc}
    alt={item.alt}
    style={{ display: 'block', height: '6vh', objectFit: 'contain' }}
  />
)

type Props = {
  set: GalleryType
  hideDelete?: boolean
  onUpdateGalleryRel: (galleryRelId: number) => void
  onUpdateGalleryPhotos: (fileId: string, galleryId: number) => void
  cookies: Cookies
}

const GallerySet = ({
  set,
  hideDelete,
  onUpdateGalleryRel,
  onUpdateGalleryPhotos,
  cookies,
}: Props) => {
  const { id, patientGalleryRelId, photos, patient, tags } = set
  const tagKey = `gallery_set_${id}`

  const galleryRef = useRef<any>(null)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [images, setImages] = useState<Image[]>([])
  const { clientInfo } = useClientContext()

  const updatePhotos = async (
    patientId: string,
    access_token: string | null,
    item: Image,
  ) => {
    const gallery: PatientGallery = {
      galeria: {
        create: [],
        update: [
          {
            id: patientGalleryRelId,
            galeria_id: {
              id: id,
              fotos: {
                create: [],
                update: [],
                delete: [item.id],
              },
            },
          },
        ],
        delete: [],
      },
    }
    const resDeletePhoto = await patchPatient(patientId, gallery, access_token)
    if (resDeletePhoto) {
      onUpdateGalleryPhotos(item.fileId, id)
      return true
    }
    return false
  }

  const deletePhotoGroup = async (
    patientId: string,
    access_token: string | null,
  ) => {
    const gallery: PatientGallery = {
      galeria: {
        create: [],
        update: [],
        delete: [patientGalleryRelId],
      },
    }
    const resDeletePhotoGroup = await patchPatient(
      patientId,
      gallery,
      access_token,
    )
    if (resDeletePhotoGroup) {
      onUpdateGalleryRel(patientGalleryRelId)
      return true
    }
    return false
  }

  const deleteImage = async (item: Image) => {
    if (clientInfo) {
      setImageLoading(true)
      const patientId = clientInfo.id.toString()
      const access_token = await refreshToken(cookies)
      const deleteFile =
        images.length > 1
          ? await updatePhotos(patientId, access_token, item)
          : await deletePhotoGroup(patientId, access_token)
      if (deleteFile) {
        item.fileId && (await deleteFileToDirectus(item.fileId, access_token))
        setImages((prevImage) => prevImage.filter((i) => i.id !== item.id))
      }
      setImageLoading(false)
    }
  }

  const confirmDelete = async (tagKey: string, item: Image) => {
    confirmDialog({
      tagKey,
      acceptLabel: 'Si',
      rejectLabel: 'No',
      message: 'Está seguro de eliminar esta imagen?',
      header: 'Confirmación',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      draggable: false,
      async accept() {
        await deleteImage(item)
      },
    })
  }

  const itemTemplate = (item: Image) => {
    if (!item) item = images[0]
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ display: 'block', height: '90vh', objectFit: 'contain' }}
      />
    )
  }

  const captionTemplate = (item: Image) => {
    if (!item) item = images[0]
    return (
      <>
        <ConfirmDialog tagKey={tagKey} />
        <section className='flex flex-col gap-4 md:flex-row items-center'>
          <div className='grow w-full'>
            <div className='text-xl mb-2 font-bold'>{item.title}</div>
            <p className='text-white'>{item.tags}</p>
          </div>
          {!hideDelete && (
            <Button
              className='w-full md:!w-[7rem] h-fit'
              label='Eliminar'
              type='button'
              severity='danger'
              loading={imageLoading}
              onClick={() => confirmDelete(tagKey, item)}
            />
          )}
        </section>
      </>
    )
  }

  const photosMap = (photos: ClientPhoto[]) =>
    photos?.map((p) => {
      const file = p.directus_files_id
      const imageUrl = generateURLAssetsWithToken(file?.id as string, {
        quality: '15',
        fit: 'cover',
      })
      return {
        id: p.id,
        fileId: file?.id,
        itemImageSrc: imageUrl,
        thumbnailImageSrc: imageUrl,
        alt: file?.description ?? file?.title,
        title: patient,
        tags: tags,
      } as Image
    })

  useEffect(() => {
    setImages(photosMap(photos))
  }, [])

  return (
    <>
      <Galleria
        ref={galleryRef}
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={maxVisible}
        style={{ width: '90%' }}
        circular
        fullScreen
        showItemNavigators
        thumbnailsPosition='bottom'
        item={itemTemplate}
        caption={captionTemplate}
        thumbnail={thumbnailTemplate}
        className='[&_.p-galleria-close]:z-10 [&_.p-galleria-thumbnail-item]:cursor-default [&_.p-galleria-thumbnail-item_img]:cursor-pointer'
      />
      <Button
        icon='pi pi-camera'
        onClick={() => {
          galleryRef.current.show()
          setImages(photosMap(photos))
        }}
        className='text-sm [&_.pi-camera:before]:text-lg'
      />
    </>
  )
}

export default withCookies(GallerySet)
