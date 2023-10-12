import { ClientDataSheet } from '@components/templates'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DHI | Ficha del Paciente',
}

const DataSheetPage = () => <ClientDataSheet />

export default DataSheetPage
