import { Metadata } from 'next'
import { ClientFinanceCreate } from '@components/templates'

export const metadata: Metadata = {
  title: 'DHI | Crear factura del Paciente',
}

const FinanceCreatePage = () => <ClientFinanceCreate />

export default FinanceCreatePage
