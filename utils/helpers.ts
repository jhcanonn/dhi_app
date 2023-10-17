/* Los campos que se mapean son del Evento */

import { PrimitiveValue, parseTemplate } from 'url-template'
import moment from 'moment'
import 'moment/locale/es'

export const calendarFieldsMapper = (resource: string) => {
  return {
    idField: `${resource}_id`,
    textField: 'title',
  }
}

export const getResourceData = <T>(
  resources: T[],
  resourceField: string,
  resourceId: number,
) => {
  return resources.find((r) => r[resourceField as keyof T] === resourceId)
}

export function daysToMilliseconds(days: number) {
  // 👇️        hour  min  sec  ms
  return days * 24 * 60 * 60 * 1000
}

export const expiresCookie = () => {
  const expireDays = Number(process.env.NEXT_PUBLIC_COOKIE_EXPIRE_DAYS)
  return new Date(new Date().getTime() + daysToMilliseconds(expireDays))
}

export const getOnlyDate = (date: Date) => {
  const dp = date.toLocaleDateString('es-CL').slice(0, 10).split('-')
  return `${dp[2]}-${dp[1]}-${dp[0]}`
}

export const parseUrl = (
  url: string,
  template: Record<
    string,
    PrimitiveValue | PrimitiveValue[] | Record<string, PrimitiveValue>
  >,
): string => {
  const urlParse = parseTemplate(url)
  return urlParse.expand(template)
}

export const toTitleCase = (text: string) =>
  text
    .split(' ')
    .filter((word) => word)
    .map((word) => {
      const wordLC = word.toLowerCase()
      return wordLC[0].toUpperCase() + wordLC.substring(1)
    })
    .join(' ')

export const calcularEdadConMeses = (fechaNacimiento: Date) => {
  const fechaActual = new Date()

  let anios = fechaActual.getFullYear() - fechaNacimiento.getFullYear()
  let meses = fechaActual.getMonth() - fechaNacimiento.getMonth()

  if (meses < 0) {
    anios--
    meses += 12
  }

  return { anios, meses }
}

export const removeDuplicates = (arr: any[]): any[] => {
  const uniqueSet = new Set(arr.map((a) => JSON.stringify(a)))
  return Array.from(uniqueSet).map((a) => JSON.parse(a))
}

export const getFormatedDateToEs = (date: string) =>
  moment(date).locale('es').format('ll')
