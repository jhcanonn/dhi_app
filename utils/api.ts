import { AppointmentDirectus, Country, Holiday } from '@models'
import axios from 'axios'

export const getHolidays = (year: number) =>
  axios
    .get(
      `https://api.generadordni.es/v2/holidays/holidays?country=CO&year=${year}`,
    )
    .then((res) => res.data as Holiday[])

export const getCountries = () =>
  axios
    .get(`https://restcountries.com/v3.1/all?fields=name,idd,flag,flags`)
    .then(
      (res) =>
        res.data.map((d: any) => ({
          name: d.name.common,
          image_url: d.flags.png,
          dialling: d.idd.root + d.idd.suffixes[0],
        })) as Country[],
    )

export const createAppointment = async (
  payload: AppointmentDirectus,
  token: string,
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rest/appointment`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return res.data?.data
}

export const editAppointment = async (
  eventId: number,
  payload: AppointmentDirectus,
  token: string,
) => {
  const res = await axios.put(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rest/appointment/${eventId}`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return res.data?.data
}

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
