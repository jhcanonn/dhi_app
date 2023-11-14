'use client'

import GallerySet from './GallerySet'
import { useClientContext } from '@contexts'
import { DataTable } from 'primereact/datatable'
import { useEffect, useState } from 'react'
import { getFormatedDateToEs } from '@utils'
import { ClientPhoto, DataTableDate, StatusDirectus } from '@models'
import { Column } from 'primereact/column'
import { usePatchPatient } from '@hooks'
import moment from 'moment'

export interface GalleryType {
  id: number
  patientGalleryRelId: number
  description: string
  date: DataTableDate
  photos: ClientPhoto[]
  patient: string
  user: string
  tags: string
}

const dateBodyTemplate = (gallery: GalleryType) => (
  <p>{gallery.date.formated}</p>
)

const GalleryTable = ({ hideImageDelete }: { hideImageDelete?: boolean }) => {
  const [gallery, setGallery] = useState<GalleryType[]>([])
  const { clientInfo, setClientInfo } = useClientContext()
  const { deleteGalleryPhotos } = usePatchPatient()

  const handleUpdatePhotos = (fileId: string) => {
    const updatedGallery = gallery.map((g) => ({
      ...g,
      photos: g.photos?.filter((p) => p?.directus_files_id?.id !== fileId),
    }))
    updatedGallery.forEach(async (g) => {
      if (g.photos.length === 0) {
        updatedGallery.splice(updatedGallery.indexOf(g), 1)
        await deleteGalleryPhotos(g.patientGalleryRelId)
      }
    })
    setGallery(updatedGallery)

    if (clientInfo) {
      const updatedClient = {
        ...clientInfo,
        galeria: clientInfo.galeria.map((g) => ({
          ...g,
          galeria_id: {
            ...g.galeria_id,
            fotos: g.galeria_id.fotos?.filter(
              (p) => p?.directus_files_id?.id !== fileId,
            ),
          },
        })),
      }
      updatedClient.galeria.forEach((g) => {
        g.galeria_id.fotos.length === 0 &&
          updatedClient.galeria.splice(updatedClient.galeria.indexOf(g), 1)
      })
      setClientInfo(updatedClient)
    }
  }

  const actionsBodyTemplate = (gallery: GalleryType) => (
    <GallerySet
      set={gallery}
      hideDelete={hideImageDelete}
      onUpdatePhotos={handleUpdatePhotos}
    />
  )

  useEffect(() => {
    const gallery = clientInfo?.galeria.map((g) => {
      const gallery = g.galeria_id
      const tags = gallery?.tags ? [...gallery.tags] : []
      const userCreated = gallery.user_created
      const user = userCreated.profesional
        ? userCreated.profesional.nombre
        : `${userCreated.first_name} ${userCreated.last_name}`

      return {
        id: gallery?.id,
        patientGalleryRelId: g.id,
        date: {
          date: moment(gallery?.date_created).toDate(),
          timestamp: moment(gallery?.date_created).valueOf(),
          formated: getFormatedDateToEs(gallery?.date_created, 'ddd ll'),
        },
        description: gallery?.descripcion,
        photos: gallery?.fotos,
        patient: clientInfo.full_name,
        user,
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
      removableSort
      sortField='date.timestamp'
      sortOrder={-1}
    >
      <Column
        key='tags'
        field='tags'
        header='Etiquetas'
        style={{ width: '45%' }}
        sortable
      />
      <Column
        key='date'
        field='date.timestamp'
        header='Fecha'
        body={dateBodyTemplate}
        style={{ width: '20%' }}
        sortable
      />
      <Column
        key='user'
        field='user'
        header='Usuario'
        style={{ width: '15%' }}
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
  )
}

export default GalleryTable
