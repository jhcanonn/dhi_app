import ClientList from '@components/templates/ClientList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Clientes',
}

const Client = () => <ClientList />

export default Client
