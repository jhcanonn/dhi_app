import { ComingSoon } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Detalle del Cliente',
}

const ClientID = ({ params }: { params: { id: string } }) => (
  <ComingSoon page={`Detalle del Cliente ${params.id}`} />
)

export default ClientID
