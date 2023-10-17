'use client'

import { useEffect, useState } from 'react'
import { GallerySet } from '@components/organisms'
import { useClientContext } from '@contexts'
import { ClientPhoto } from '@models'
import { Card } from 'primereact/card'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { ProgressSpinner } from 'primereact/progressspinner'
import { getFormatedDateToEs } from '@utils'

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
    const gallery = clientInfo?.galeria.map(
      (g) =>
        ({
          date: getFormatedDateToEs(g.galeria_id?.date_created),
          description: g.galeria_id?.descripcion,
          photos: g.galeria_id?.fotos,
        }) as Gallery,
    )
    gallery && setGallery(gallery)
  }, [clientInfo])

  return (
    <Card className='custom-table-card'>
      {clientInfo ? (
        <DataTable
          value={gallery}
          emptyMessage='No se encontraron resultados'
          size='small'
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '40rem' }}
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
