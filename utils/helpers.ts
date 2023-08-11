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

export const refreshToken = async (
  refresh_token: string,
  access_token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({ refresh_token }),
    },
  )
  const content = await response.json()
  return content?.data
}
