import { ClientDetail } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Detalle del Paciente',
}

const ClientDetailPage = () => <ClientDetail />

export default ClientDetailPage
