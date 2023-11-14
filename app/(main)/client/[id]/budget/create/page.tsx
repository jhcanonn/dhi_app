import { ClientBudgetForm } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Presupuesto del Paciente',
}

const BudgetCreate = () => <ClientBudgetForm />

export default BudgetCreate
