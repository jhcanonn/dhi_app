'use client'

import { useClientContext } from '@contexts'
import { DataTable } from 'primereact/datatable'
import { useEffect, useState } from 'react'
import { getFormatedDateToEs } from '@utils'
import { ClientPhoto, StatusDirectus } from '@models'
import { Column } from 'primereact/column'
import GallerySet from './GallerySet'

export interface GalleryType {
  id: number
  patientGalleryRelId: number
  description: string
  date: string
  photos: ClientPhoto[]
  patient: string
  tags: string
}

const GalleryTable = ({ hideImageDelete }: { hideImageDelete?: boolean }) => {
  const [gallery, setGallery] = useState<GalleryType[]>([])
  const { clientInfo } = useClientContext()

  const handleUpdateGalleryRel = (galleryRelId: number) =>
    setGallery(gallery.filter((g) => g.patientGalleryRelId !== galleryRelId))

  const handleUpdateGalleryPhotos = (fileId: string, galleryId: number) => {
    setGallery(
      gallery.map((g) => ({
        ...g,
        photos:
          g.id === galleryId
            ? g.photos?.filter((p) => p?.directus_files_id?.id !== fileId)
            : g.photos?.map((p) =>
                p?.directus_files_id?.id === fileId
                  ? { ...p, directus_files_id: null }
                  : p,
              ),
      })),
    )
  }

  const actionsBodyTemplate = (gallery: GalleryType) => (
    <GallerySet
      set={gallery}
      hideDelete={hideImageDelete}
      onUpdateGalleryRel={handleUpdateGalleryRel}
      onUpdateGalleryPhotos={handleUpdateGalleryPhotos}
    />
  )

  useEffect(() => {
    const gallery = clientInfo?.galeria.map((g) => {
      const gallery = g.galeria_id
      const tags = gallery?.tags ? [...gallery.tags] : []
      return {
        id: gallery?.id,
        patientGalleryRelId: g.id,
        date: getFormatedDateToEs(gallery?.date_created),
        description: gallery?.descripcion,
        photos: gallery?.fotos,
        patient: clientInfo.full_name,
        tags: tags
          .sort((a, b) => a.order - b.order)
          .filter((g) => g.tags_id.estado === StatusDirectus.PUBLISHED)
          .map((g) => g.tags_id.nombre)
          .join(', '),
      } as GalleryType
    })
    gallery && setGallery(gallery)
  }, [clientInfo])

  return (
    <DataTable
      value={gallery}
      emptyMessage='No se encontraron resultados'
      size='small'
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      tableStyle={{ minWidth: '40rem' }}
      className='custom-table'
      loading={clientInfo === null}
    >
      <Column
        key='tags'
        field='tags'
        header='Etiquetas'
        style={{ width: '50%' }}
      />
      <Column key='date' field='date' header='Fecha' style={{ width: '30%' }} />
      <Column
        key='actions'
        header='Acción'
        align={'center'}
        body={actionsBodyTemplate}
        style={{ width: '20%' }}
      />
    </DataTable>
  )
}

export default GalleryTable
