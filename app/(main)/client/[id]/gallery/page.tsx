import { ClientGallery } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Galería del Paciente',
}

const ClientGalleryPage = () => <ClientGallery />

export default ClientGalleryPage
