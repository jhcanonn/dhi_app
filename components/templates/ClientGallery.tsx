'use client'

import { GallerySet } from '@components/organisms'
import { useClientContext } from '@contexts'
import { ClientPhoto } from '@models'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { useEffect, useState } from 'react'
import moment from 'moment'
import 'moment/locale/es'
import { ProgressSpinner } from 'primereact/progressspinner'

interface Gallery {
  description: string
  date: string
  photos: ClientPhoto[]
}

const ClientGallery = () => {
  const [gallery, setGallery] = useState<Gallery[]>([])
  const { clientInfo } = useClientContext()

  const actionsBodyTemplate = (gallery: Gallery) => (
    <GallerySet photos={gallery.photos} />
  )

  useEffect(() => {
    const gallery = clientInfo?.galeria.map((g) => {
      const formatedDate = moment(g.galeria_id?.date_created)
        .locale('es')
        .format('ll')
      return {
        date: formatedDate,
        description: g.galeria_id?.descripcion,
        photos: g.galeria_id?.fotos,
      } as Gallery
    })
    gallery && setGallery(gallery)
  }, [clientInfo])

  return (
    <Card className='custom-table-card'>
      {clientInfo ? (
        <DataTable
          value={gallery}
          emptyMessage='No se encontraron resultados'
          size='small'
          showGridlines
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          className='custom-table'
        >
          <Column
            key='description'
            field='description'
            header='Descripción'
            style={{ width: '60%' }}
          />
          <Column
            key='date'
            field='date'
            header='Fecha'
            style={{ width: '30%' }}
          />
          <Column
            key='actions'
            field='actions'
            header='Acción'
            body={actionsBodyTemplate}
            style={{ width: '10%' }}
          />
        </DataTable>
      ) : (
        <ProgressSpinner />
      )}
    </Card>
  )
}

export default ClientGallery
