import { ClientDataSheet } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Historia clínica del Paciente',
}

const DataSheetPage = () => <ClientDataSheet />

export default DataSheetPage
