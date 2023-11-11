import { ClientBudget } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Presupuesto del Paciente',
}

const Budget = () => <ClientBudget />

export default Budget
