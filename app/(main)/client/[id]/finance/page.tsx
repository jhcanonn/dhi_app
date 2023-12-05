import { ClientFinance } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Resumen financiero',
}

const Finance = () => <ClientFinance />

export default Finance
