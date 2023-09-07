/* Los campos que se mapean son del Evento */

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
