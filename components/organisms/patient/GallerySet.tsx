'use client'

import { generateURLAssetsWithToken } from '@utils/url-access-token'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria'
import { useEffect, useRef, useState } from 'react'
import { GalleryType } from './GalleryTable'
import { UUID } from 'crypto'
import { useClientContext } from '@contexts'
import { ClientPhoto } from '@models'
import { deleteFileToDirectus, refreshToken } from '@utils'
import { Cookies, withCookies } from 'react-cookie'
import { usePatchPatient } from '@hooks'
import { Image } from 'primereact/image'

type ImageType = {
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

const thumbnailTemplate = (item: ImageType) => (
  <div className='flex items-center h-[6vh]'>
    <Image
      src={item.thumbnailImageSrc}
      alt={item.alt}
      style={{ objectFit: 'contain' }}
      className='[&_img]:max-h-[6vh]'
    />
  </div>
)

type Props = {
  set: GalleryType
  hideDelete?: boolean
  onUpdatePhotos: (fileId: string) => void
  cookies: Cookies
}

const GallerySet = ({ set, hideDelete, onUpdatePhotos, cookies }: Props) => {
  const { id, patientGalleryRelId, photos, patient, tags } = set
  const tagKey = `gallery_set_${id}`

  const galleryRef = useRef<any>(null)
  const [imageLoading, setImageLoading] = useState<boolean>(false)
  const [images, setImages] = useState<ImageType[]>([])
  const { clientInfo } = useClientContext()
  const { updateGalleryPhotos } = usePatchPatient()

  const deleteImage = async (item: ImageType) => {
    if (clientInfo) {
      setImageLoading(true)
      const access_token = await refreshToken(cookies)
      const updatedPhotos = await updateGalleryPhotos(
        patientGalleryRelId,
        id,
        item.id,
      )
      if (updatedPhotos) {
        item.fileId && (await deleteFileToDirectus(item.fileId, access_token))
        setImages((prevImage) => prevImage.filter((i) => i.id !== item.id))
        onUpdatePhotos(item.fileId)
      }
      setImageLoading(false)
    }
  }

  const confirmDelete = async (tagKey: string, item: ImageType) => {
    document.body.style.overflow = 'hidden'
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

  const itemTemplate = (item: ImageType) => {
    if (!item) item = images[0]
    return (
      <div className='flex items-center h-[90vh]'>
        <Image
          src={item.itemImageSrc}
          alt={item.alt}
          style={{ objectFit: 'contain' }}
          className='[&_img]:max-h-[90vh]'
        />
      </div>
    )
  }

  const captionTemplate = (item: ImageType) => {
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
      } as ImageType
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
        onHide={() => document.body.style.removeProperty('overflow')}
      />
      <Button
        label='Ver set'
        icon='pi pi-camera'
        size='small'
        outlined
        onClick={() => {
          galleryRef.current.show()
          setImages(photosMap(photos))
        }}
        className='[&_.pi-camera:before]:text-lg !py-[0.3rem]'
      />
    </>
  )
}

export default withCookies(GallerySet)
