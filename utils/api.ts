import { Holiday } from '@models'
import axios from 'axios'

export const getHolidays = (year: number) => () =>
  axios
    .get(
      `https://api.generadordni.es/v2/holidays/holidays?country=CO&year=${year}`,
    )
    .then((res) => res.data as Holiday[])

export const fetchVerifyToken = async (token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rest/app/validate-token`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
    },
  )
  return await response.json()
}

export const fetchRefreshToken = async (refresh_token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    },
  )
  const content = await response.json()
  return content?.data
}
