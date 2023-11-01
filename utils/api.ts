import { Cookies } from 'react-cookie'
import { DHI_SESSION, REQUEST_ATTEMPT_NUMBER, errorCodes } from './constants'
import { AuthLogin } from '@models'
import { expiresCookie } from './helpers'
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

export const getPanelsFromDirectus = async (token: string | null) => {
  const agrupadores_id = 'agrupadores_id'
  const agrupadores_code = `${agrupadores_id}.agrupadores_code`
  const campos_id = `${agrupadores_code}.campos_id`
  const _campos_id = `${campos_id}.campos_id`
  const fields = `fields=*,${agrupadores_id}.*,${agrupadores_code}.*,${campos_id}.*,${_campos_id}.*`

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/items/paneles?${fields}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return res.data?.data
}

export const createAppointment = async (
  payload: AppointmentDirectus,
  token: string | null,
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

export const createBlock = async (
  payload: AppointmentDirectus,
  token: string | null,
) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/rest/appointment/block`,
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
  token: string | null,
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

export const fetch_retry = async (
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  n: number,
): Promise<Response> => {
  try {
    return await fetch(url, options)
  } catch (err) {
    if (n === 1) throw err
    return await fetch_retry(url, options, n - 1)
  }
}

export const fetchRefreshToken = async (refresh_token: string) => {
  const response = await fetch_retry(
    `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/auth/refresh`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token }),
    },
    REQUEST_ATTEMPT_NUMBER,
  )
  const content = await response.json()
  return content?.data
}

export const refreshToken = async (cookies: Cookies) => {
  const session = cookies?.get(DHI_SESSION)
  const access_token: string = session ? session.access_token : undefined
  let newToken = null

  // If token is not expired, return it
  if (
    access_token &&
    access_token.split('.').length > 1 &&
    JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString())
      .exp *
      1000 >
      Date.now()
  ) {
    return access_token
  }

  try {
    const { status } = await fetchVerifyToken(access_token)
    if (status === errorCodes.ERR_JWT_EXPIRED) {
      console.info('Refreshing token...')
      const response: AuthLogin = await fetchRefreshToken(session.refresh_token)
      if (response) {
        cookies.set(DHI_SESSION, response, {
          path: '/',
          expires: expiresCookie(),
        })
        newToken = response.access_token
        console.info('Refresh token DONE!')
      } else {
        cookies.remove(DHI_SESSION)
      }
    } else {
      newToken = access_token
    }
  } catch (error: any) {
    console.error(error)
    cookies.remove(DHI_SESSION)
  }

  return newToken
}

export const uploadFileToDirectus = async (
  formData: FormData,
  token: string | null,
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/files`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data?.data
  } catch (error: any) {
    throw new Error(error)
  }
}

export const deleteFileToDirectus = async (
  id: string,
  token: string | null,
) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/files`,
      {
        data: [id],
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data?.data
  } catch (error: any) {
    throw new Error(error)
  }
}

export const patchPatient = async (
  id: string,
  payload: any,
  token: string | null,
) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/items/pacientes/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data?.data
  } catch (error: any) {
    throw new Error(error)
  }
}
