'use client'

import {
  CheckboxValid,
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  InputTextareaValid,
} from '@components/atoms'
import { useGlobalContext } from '@contexts'
import {
  CamposRelDirectus,
  DisenioResponsivoDirectus,
  FieldTypeDirectus,
  PanelsDirectus,
} from '@models'
import { regexPatterns } from '@utils'
import moment from 'moment'
import { Button } from 'primereact/button'
import { Fieldset } from 'primereact/fieldset'
import { classNames as cx } from 'primereact/utils'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'

type Props = {
  panel: PanelsDirectus
  onCustom?: () => void
}

type GridProps = {
  children?: ReactNode
  responsive: DisenioResponsivoDirectus
}

const PanelForm = ({ panel, onCustom }: Props) => {
  const { user } = useGlobalContext()

  let defaultValues: any = {}
  const hasFirma = panel.bloque_de_firma && user?.profesional

  if (hasFirma)
    defaultValues = {
      firma_profesional: user?.profesional.nombre,
      firma_registro_medico: user?.profesional.no_registro_medico,
      firma_hora_de_cierre: undefined,
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

  const handleForm = useForm({ defaultValues })
  const { handleSubmit, getValues, setValue } = handleForm

  const onSubmit = async (data: any) => {
    console.log({ data })
    hasFirma && setValue('firma_hora_de_cierre', moment().toDate())
    onCustom && onCustom()
    console.log(getValues())
  }

  const FieldsGrid = ({ children, responsive }: GridProps) => {
    const colsMobile = responsive.mobile.columnas
    const colsTablet = responsive.tablet.columnas
    const colsDesktop = responsive.desktop.columnas
    return (
      <div
        className={cx(
          'grid gap-x-4 m-0',
          { 'grid-cols-1': colsMobile === 1 },
          { 'grid-cols-2': colsMobile === 2 },
          { 'grid-cols-3': colsMobile === 3 },
          { 'grid-cols-4': colsMobile === 4 },
          { 'grid-cols-5': colsMobile === 5 },
          { 'md:grid-cols-1': colsTablet === 1 },
          { 'md:grid-cols-2': colsTablet === 2 },
          { 'md:grid-cols-3': colsTablet === 3 },
          { 'md:grid-cols-4': colsTablet === 4 },
          { 'md:grid-cols-5': colsTablet === 5 },
          { 'xl:grid-cols-1': colsDesktop === 1 },
          { 'xl:grid-cols-2': colsDesktop === 2 },
          { 'xl:grid-cols-3': colsDesktop === 3 },
          { 'xl:grid-cols-4': colsDesktop === 4 },
          { 'xl:grid-cols-5': colsDesktop === 5 },
        )}
      >
        {children}
      </div>
    )
  }

  const handleExtraButton = (fields: CamposRelDirectus[]) => {
    fields.forEach((f) => {
      const field = f.campos_id
      field.valor_accionado &&
        setValue(field.codigo, field.valor_accionado, { shouldValidate: true })
    })
  }

  return (
    <form
      autoComplete='off'
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-3 text-sm items-center [&>*]:w-full mt-2'
    >
      {panel.agrupadores_id
        .sort((a, b) => a.orden - b.orden)
        .map((a) => {
          const groupers = a.agrupadores_code
          const gruoperLabel = groupers.etiqueta
          const buttonExtraLabel = groupers.etiqueta_boton_extra?.trim()
          const fields = groupers.campos_id
            .sort((a, b) => a.orden - b.orden)
            .map((c) => {
              const field = c.campos_id
              switch (field.tipo) {
                case FieldTypeDirectus.TEXT:
                  return (
                    <InputTextValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      required={field.validaciones?.required}
                      pattern={regexPatterns.onlyEmpty}
                      disabled={field.deshabilitado}
                    />
                  )
                case FieldTypeDirectus.TEXTAREA:
                  return (
                    <InputTextareaValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      rows={
                        field.filas_grilla > 1
                          ? field.filas_por_defecto * 2
                          : field.filas_por_defecto
                      }
                      gridRows={field.filas_grilla}
                      pattern={regexPatterns.onlyEmpty}
                      disabled={field.deshabilitado}
                    />
                  )
                case FieldTypeDirectus.NUMBER:
                  return (
                    <InputNumberValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      required={field.validaciones?.required}
                      showButtons
                      mode='decimal'
                      disabled={field.deshabilitado}
                    />
                  )
                case FieldTypeDirectus.DROPDOWN:
                  return (
                    <DropdownValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      list={field.opciones?.length ? field.opciones : []}
                      required={field.validaciones?.required}
                      disabled={field.deshabilitado}
                    />
                  )
                case FieldTypeDirectus.DATETIME:
                  return (
                    <DateTimeValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      required={field.validaciones?.required}
                      stepMinute={1}
                      showIcon={false}
                      disabled={field.deshabilitado}
                    />
                  )
                case FieldTypeDirectus.CHECKBOX:
                  return (
                    <CheckboxValid
                      key={field.codigo}
                      name={field.codigo}
                      label={field.etiqueta}
                      handleForm={handleForm}
                      required={field.validaciones?.required}
                      list={field.opciones?.length ? field.opciones : []}
                      gridRows={field.filas_grilla}
                      disabled={field.deshabilitado}
                    />
                  )
                default:
                  return (
                    <p key={field.codigo}>
                      No hay campo definido para
                      <b> '{field.etiqueta}'</b>
                    </p>
                  )
              }
            })

          const ButtonExtraAndFields = () => (
            <>
              {buttonExtraLabel && (
                <Button
                  type='button'
                  label={buttonExtraLabel}
                  severity='help'
                  size='small'
                  className={cx(
                    'w-full mb-4 md:w-fit md:mb-0 md:absolute md:right-4',
                    { 'md:top-[-2.1rem]': gruoperLabel },
                    { 'md:top-[-1.2rem]': !gruoperLabel },
                  )}
                  onClick={() => handleExtraButton(groupers.campos_id)}
                />
              )}
              <FieldsGrid responsive={groupers.diseno_responsivo}>
                {fields}
              </FieldsGrid>
            </>
          )

          return gruoperLabel ? (
            <Fieldset
              key={groupers.code}
              legend={gruoperLabel}
              className='relative'
            >
              {ButtonExtraAndFields()}
            </Fieldset>
          ) : (
            <div
              key={groupers.code}
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
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 m-0'>
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
      <Button label='Guardar atención' className='text-sm w-fit' />
    </form>
  )
}

export default PanelForm
