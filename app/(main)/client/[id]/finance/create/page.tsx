import { Metadata } from 'next'
import { ClientFinanceForm } from '@components/templates'

export const metadata: Metadata = {
  title: 'DHI | Crear factura del Paciente',
}

const FinanceCreatePage = () => <ClientFinanceForm />

export default FinanceCreatePage
