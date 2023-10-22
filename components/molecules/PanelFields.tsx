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
import {
  AgrupadoresDirectus,
  CamposDirectus,
  CamposFuenteDatos,
  CamposOpcionesDirectus,
  DisenioResponsivoDirectus,
  FieldTypeDirectus,
} from '@models'
import { regexPatterns } from '@utils'
import { UseFormReturn } from 'react-hook-form'
import { classNames as cx } from 'primereact/utils'
import PanelFieldAutocomplete from './PanelFieldAutocomplete'
import { handlesAutoField } from '@hooks'

type Props = {
  group: AgrupadoresDirectus
  handleForm: UseFormReturn<any, any, undefined>
  disabledData?: boolean
}

const cssFullWith = (responsive: DisenioResponsivoDirectus) => {
  const colsMobile = responsive.mobile.columnas
  const colsTablet = responsive.tablet.columnas
  const colsDesktop = responsive.desktop.columnas
  return cx(
    { 'col-span-1': colsMobile === 1 },
    { 'col-span-2': colsMobile === 2 },
    { 'col-span-3': colsMobile === 3 },
    { 'col-span-4': colsMobile === 4 },
    { 'col-span-5': colsMobile === 5 },
    { 'md:col-span-1': colsTablet === 1 },
    { 'md:col-span-2': colsTablet === 2 },
    { 'md:col-span-3': colsTablet === 3 },
    { 'md:col-span-4': colsTablet === 4 },
    { 'md:col-span-5': colsTablet === 5 },
    { 'xl:col-span-1': colsDesktop === 1 },
    { 'xl:col-span-2': colsDesktop === 2 },
    { 'xl:col-span-3': colsDesktop === 3 },
    { 'xl:col-span-4': colsDesktop === 4 },
    { 'xl:col-span-5': colsDesktop === 5 },
  )
}

const cssColsResponsive = (
  responsive: DisenioResponsivoDirectus,
  disabledData: boolean | undefined,
) => {
  const colsMobile = responsive.mobile.columnas
  const colsTablet = responsive.tablet.columnas
  const colsDesktop = responsive.desktop.columnas
  return cx(
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
  )
}

const getFieldList = (field: CamposDirectus) => {
  let list: CamposOpcionesDirectus[] = []

  switch (field.fuente_datos) {
    case CamposFuenteDatos.OPTIONS_JSON:
      list = field.opciones?.length ? field.opciones : []
      break
    case CamposFuenteDatos.LOCAL_STORAGE: {
      const lsData = window.localStorage.getItem(field.variable_datos)
      list = lsData ? (JSON.parse(lsData) as CamposOpcionesDirectus[]) : []
      break
    }
  }

  return list
}

const PanelFields = ({ group, handleForm, disabledData }: Props) => {
  const responsive = group.diseno_responsivo
  return (
    <div className={cssColsResponsive(responsive, disabledData)}>
      {group.campos_id
        .sort((a, b) => a.orden - b.orden)
        .map((c) => {
          const field = c.campos_id
          const fieldDisable = field.deshabilitado || disabledData
          const fieldClassName = field.ancho_completo
            ? cssFullWith(responsive)
            : ''

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
                  disabled={fieldDisable}
                  className={fieldClassName}
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
                  disabled={fieldDisable}
                  className={fieldClassName}
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
                  disabled={fieldDisable}
                  className={fieldClassName}
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
                  disabled={fieldDisable}
                  className={fieldClassName}
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
                  showIcon={!fieldDisable}
                  disabled={fieldDisable}
                  className={fieldClassName}
                />
              )
            case FieldTypeDirectus.DATE:
              return (
                <DateTimeValid
                  key={field.codigo}
                  name={field.codigo}
                  label={field.etiqueta}
                  handleForm={handleForm}
                  required={field.validaciones?.required}
                  showIcon={!fieldDisable}
                  disabled={fieldDisable}
                  showTime={false}
                  className={fieldClassName}
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
                  disabled={fieldDisable}
                  className={fieldClassName}
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
                  disabled={fieldDisable}
                  className={fieldClassName}
                />
              )
            case FieldTypeDirectus.AUTOCOMPLETE: {
              const handleChangeAutocomplete = (
                item: any,
                selectedValue: string,
              ) => {
                const handleChange = handlesAutoField[field.variable_datos]
                handleChange(item, selectedValue, handleForm)
              }
              return (
                <PanelFieldAutocomplete
                  key={field.codigo}
                  name={field.codigo}
                  label={field.etiqueta}
                  list={getFieldList(field)}
                  onChange={handleChangeAutocomplete}
                  handleForm={handleForm}
                  required={field.validaciones?.required}
                  disabled={fieldDisable}
                  className={fieldClassName}
                />
              )
            }
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
