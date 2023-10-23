'use client'

import { DateTimeValid, InputTextValid } from '@components/atoms'
import { useGlobalContext } from '@contexts'
import { CamposRelDirectus, FieldTypeDirectus, PanelsDirectus } from '@models'
import { convertValuesToDateIfSo } from '@utils'
import moment from 'moment'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { Message } from 'primereact/message'
import { classNames as cx } from 'primereact/utils'
import { UseFormReturn, useForm } from 'react-hook-form'
import PanelFields from './PanelFields'

type Props = {
  formId: string
  panel: PanelsDirectus | undefined
  initialData?: JSON
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
}: Props) => {
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

  const onSubmit = async () => {
    hasFirma && setValue('firma_hora_de_cierre', moment().toDate())
    onFormData && onFormData(getValues())
  }

  const handleExtraButton = (fields: CamposRelDirectus[]) => {
    fields.forEach((f) => {
      const field = f.campos_id
      if (field.valor_accionado) {
        const value =
          field.tipo === FieldTypeDirectus.CHECKBOX
            ? JSON.parse(field.valor_accionado)
            : field.valor_accionado
        setValue(field.codigo, value, { shouldValidate: true })
      }
    })
  }

  return (
    <form
      id={`form_${panel.code}_${formId}`}
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 text-sm items-center [&>*]:w-full'
    >
      {panel.agrupadores_id
        .sort((a, b) => a.orden - b.orden)
        .map((a) => {
          const group = a.agrupadores_code
          const groupLabel = group.etiqueta?.trim()
          const buttonExtraLabel = group.etiqueta_boton_extra?.trim()

          const ButtonExtraAndFields = () => (
            <>
              {!disabledData && buttonExtraLabel && (
                <Button
                  type='button'
                  label={buttonExtraLabel}
                  severity='help'
                  size='small'
                  className={cx(
                    'w-full mb-4 md:w-fit md:mb-0 md:absolute md:right-4',
                    { 'md:top-[-2.1rem]': groupLabel },
                    { 'md:top-[-1.2rem]': !groupLabel },
                  )}
                  onClick={() => handleExtraButton(group.campos_id)}
                />
              )}
              <PanelFields
                panelCode={panel.code}
                group={group}
                handleForm={handleForm}
                disabledData={disabledData}
              />
            </>
          )

          return groupLabel ? (
            <Fieldset key={group.code} legend={groupLabel} className='relative'>
              {ButtonExtraAndFields()}
            </Fieldset>
          ) : (
            <div
              key={group.code}
              className={cx(
                'border border-brandGrouperColor rounded-[4px] px-4 pt-5 pb-2 relative',
                { 'mt-3': buttonExtraLabel },
              )}
            >
              {ButtonExtraAndFields()}
            </div>
          )
        })}
      {hasFirma && (
        <Fieldset legend={'Firma'}>
          <div className='!grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 m-0'>
            <InputTextValid
              name='firma_profesional'
              label='Nombre del profesional'
              handleForm={handleForm}
              disabled
            />
            <InputTextValid
              name='firma_registro_medico'
              label='No. de registro médico'
              handleForm={handleForm}
              disabled
            />
            <DateTimeValid
              name='firma_hora_de_cierre'
              label='Fecha de cierre'
              handleForm={handleForm}
              stepMinute={1}
              disabled
              showIcon={false}
            />
          </div>
        </Fieldset>
      )}
      {!hideSubmitButton && (
        <Button label='Guardar atención' className='text-sm w-fit' />
      )}
    </form>
  )
}

export default PanelForm
