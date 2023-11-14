'use client'

import moment from 'moment'
import PanelFormFields from './PanelFormFields'
import { useGlobalContext } from '@contexts'
import { FieldTypeDirectus, PanelsDirectus } from '@models'
import { convertValuesToDateIfSo } from '@utils'
import { Message } from 'primereact/message'
import { UseFormReturn, useForm } from 'react-hook-form'

export type PanelFormProps = {
  formId: string
  panel: PanelsDirectus | undefined
  initialData?: Record<string, any>
  disabledData?: boolean
  hideSubmitButton?: boolean
  handleFormExternal?: UseFormReturn<any, any, undefined>
  onFormData?: (formData: any) => void
}

const PanelForm = ({
  formId,
  panel,
  initialData,
  disabledData,
  hideSubmitButton,
  handleFormExternal,
  onFormData,
}: PanelFormProps) => {
  if (!panel)
    return (
      <Message
        severity='warn'
        text='No existe un panel configurado'
        className='border-primary w-full justify-content-start'
      />
    )

  const { user } = useGlobalContext()

  let defaultValues: any = {}

  const hasFirma = panel.bloque_de_firma && user?.profesional
  if (hasFirma) {
    defaultValues = {
      firma_profesional: user?.profesional.nombre,
      firma_registro_medico: user?.profesional.no_registro_medico,
      firma_hora_de_cierre: undefined,
    }
  }

  panel.agrupadores_id.forEach((a) => {
    a.agrupadores_code.campos_id.forEach((c) => {
      const field = c.campos_id
      let value = undefined

      switch (field.tipo) {
        case FieldTypeDirectus.DATE:
        case FieldTypeDirectus.DATETIME:
          value =
            field.valor_predeterminado === 'current'
              ? moment().toDate()
              : field.valor_predeterminado
          break
        default:
          value = field.valor_predeterminado
      }

      defaultValues[field.codigo] = value
    })
  })

  if (initialData) defaultValues = convertValuesToDateIfSo(initialData)

  let handleForm = useForm({ defaultValues })
  if (handleFormExternal) handleForm = handleFormExternal
  const { handleSubmit, setValue, getValues } = handleForm

  const onSubmit = () => {
    hasFirma && setValue('firma_hora_de_cierre', moment().toDate())
    onFormData && onFormData(getValues())
  }

  return handleFormExternal ? (
    <PanelFormFields
      handleForm={handleForm}
      panel={panel}
      hasFirma={hasFirma}
      disabledData={disabledData}
      hideSubmitButton={hideSubmitButton}
    />
  ) : (
    <form
      id={`form_${panel.code}_${formId}`}
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 text-sm items-center [&>*]:w-full'
    >
      <PanelFormFields
        handleForm={handleForm}
        panel={panel}
        hasFirma={hasFirma}
        disabledData={disabledData}
        hideSubmitButton={hideSubmitButton}
      />
    </form>
  )
}

export default PanelForm
