'use client'

import { ClientPhoto } from '@models'
import { generateURLAssetsWithToken } from '@utils/url-img-access'
import { Button } from 'primereact/button'
import { Galleria, GalleriaResponsiveOptions } from 'primereact/galleria'
import { useEffect, useRef, useState } from 'react'

type Image = {
  itemImageSrc: string
  thumbnailImageSrc: string
  alt: string
  title: string
}

const GallerySet = ({ photos }: { photos: ClientPhoto[] }) => {
  const [images, setImages] = useState<Image[]>([])
  const galleryRef = useRef<any>(null)

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

  const itemTemplate = (item: Image) => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ display: 'block', height: '90vh', objectFit: 'contain' }}
      />
    )
  }

  const thumbnailTemplate = (item: Image) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{ display: 'block', height: '6vh', objectFit: 'contain' }}
      />
    )
  }

  useEffect(() => {
    const images = photos?.map((p) => {
      const imageUrl = generateURLAssetsWithToken(p.directus_files_id?.id, {
        quality: '15',
        fit: 'cover',
      })
      return {
        itemImageSrc: imageUrl,
        thumbnailImageSrc: imageUrl,
        alt: p.directus_files_id?.description ?? p.directus_files_id?.title,
        title: p.directus_files_id?.title,
      } as Image
    })
    setImages(images)
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
        thumbnail={thumbnailTemplate}
        className='[&_.p-galleria-close]:z-10'
      />
      <Button
        icon='pi pi-camera'
        onClick={() => galleryRef.current.show()}
        className='text-sm [&_.pi-camera:before]:text-lg'
      />
    </>
  )
}

export default GallerySet
