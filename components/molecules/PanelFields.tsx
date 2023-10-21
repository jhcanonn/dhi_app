'use client'

import {
  CheckboxValid,
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  InputTextareaValid,
  PhoneNumberValid,
} from '@components/atoms'
import { AgrupadoresDirectus, FieldTypeDirectus } from '@models'
import { regexPatterns } from '@utils'
import { UseFormReturn } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'

type Props = {
  group: AgrupadoresDirectus
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const PanelFields = ({ group, handleForm, disabledData }: Props) => {
  const responsive = group.diseno_responsivo
  const colsMobile = responsive.mobile.columnas
  const colsTablet = responsive.tablet.columnas
  const colsDesktop = responsive.desktop.columnas
  return (
    <div
      className={cx(
        '!grid gap-x-4',
        { 'gap-y-1': !disabledData },
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
      {group.campos_id
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
                  disabled={field.deshabilitado || disabledData}
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
                  required={field.validaciones?.required}
                  pattern={regexPatterns.onlyEmpty}
                  disabled={field.deshabilitado || disabledData}
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
                  mode='decimal'
                  disabled={field.deshabilitado || disabledData}
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
                  disabled={field.deshabilitado || disabledData}
                />
              )
            case FieldTypeDirectus.DATETIME: {
              const isDisable = field.deshabilitado || disabledData
              return (
                <DateTimeValid
                  key={field.codigo}
                  name={field.codigo}
                  label={field.etiqueta}
                  handleForm={handleForm}
                  required={field.validaciones?.required}
                  stepMinute={1}
                  showIcon={!isDisable}
                  disabled={isDisable}
                />
              )
            }
            case FieldTypeDirectus.DATE: {
              const isDisable = field.deshabilitado || disabledData
              return (
                <DateTimeValid
                  key={field.codigo}
                  name={field.codigo}
                  label={field.etiqueta}
                  handleForm={handleForm}
                  required={field.validaciones?.required}
                  showIcon={!isDisable}
                  disabled={isDisable}
                  showTime={false}
                />
              )
            }
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
                  disabled={field.deshabilitado || disabledData}
                />
              )
            case FieldTypeDirectus.PHONE:
              return (
                <PhoneNumberValid
                  key={field.codigo}
                  name={field.codigo}
                  label={field.etiqueta}
                  handleForm={handleForm}
                  required={field.validaciones?.required}
                  diallingName={`indicativo_${field.codigo}`}
                  icon='phone'
                  minLength={6}
                  disabled={field.deshabilitado || disabledData}
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
        })}
    </div>
  )
}

export default PanelFields
