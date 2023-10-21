'use client'

import PanelForm from '../PanelForm'
import { useGlobalContext } from '@contexts'
import { ProgressSpinner } from 'primereact/progressspinner'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  id: string
  handleForm: UseFormReturn<any, any, undefined>
}

const PatientDataExtra = ({ id, handleForm }: Props) => {
  const { panels } = useGlobalContext()

  return panels.length ? (
    <PanelForm
      formId={id}
      panel={panels.find((p) => p.code === 'patient')}
      handleFormExternal={handleForm}
      hideSubmitButton
    />
  ) : (
    <div className='flex justify-center'>
      <ProgressSpinner />
    </div>
  )
}

export default PatientDataExtra
