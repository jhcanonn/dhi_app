import { Metadata } from 'next'
import { ClientHistorySchedule } from '@components/templates'

export const metadata: Metadata = {
  title: 'DHI | Histórico Citas',
}

const ClientHistorySchedulePage = () => <ClientHistorySchedule />

export default ClientHistorySchedulePage
