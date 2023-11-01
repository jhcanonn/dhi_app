'use client'

import { GalleryTable } from '@components/organisms'
import { Card } from 'primereact/card'

const ClientGallery = () => (
  <Card className='custom-table-card'>
    <GalleryTable hideImageDelete />
  </Card>
)

export default ClientGallery
