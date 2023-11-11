'use client'

import PanelGroupCustom from './PanelGroupCustom'
import PanelFields from './PanelFields'
import { UseFormReturn } from 'react-hook-form'
import { PanelFormProps } from './PanelForm'
import { CamposRelDirectus, FieldTypeDirectus } from '@models'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { DateTimeValid, InputTextValid } from '@components/atoms'
import { classNames as cx } from 'primereact/utils'

type FieldsProps = Pick<
  PanelFormProps,
  'panel' | 'disabledData' | 'hideSubmitButton'
> & {
  handleForm: UseFormReturn<any, any, undefined>
  hasFirma: any
}

const PanelFormFields = ({
  panel,
  disabledData,
  hideSubmitButton,
  hasFirma,
  handleForm,
}: FieldsProps) => {
  const { setValue } = handleForm

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
    <>
      {panel?.agrupadores_id
        .sort((a, b) => a.orden - b.orden)
        .map((a) => {
          const group = a.agrupadores_code
          const groupLabel = group.etiqueta?.trim()
          const buttonExtraLabel = group.etiqueta_boton_extra?.trim()
          const customGroup = group.es_personalizado

          const ButtonExtraAndFields = () =>
            customGroup ? (
              <PanelGroupCustom
                code={group.code}
                handleForm={handleForm}
                disabledData={disabledData}
              />
            ) : (
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
                  panelCode={panel?.code}
                  group={group}
                  handleForm={handleForm}
                  disabledData={disabledData}
                />
              </>
            )

          return groupLabel ? (
            <Fieldset
              key={group.code}
              legend={groupLabel}
              className={cx('relative', { 'min-w-0': customGroup })}
            >
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
        <Button label='Guardar atención' className='text-sm w-full md:w-fit' />
      )}
    </>
  )
}

export default PanelFormFields
