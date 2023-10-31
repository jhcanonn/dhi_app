import { Cookies } from 'react-cookie'
import { DHI_SESSION } from './constants'

export const generateURLAssetsWithToken = (
  id: string,
  queryParams: Record<string, string>,
) => {
  const cookies = new Cookies()
  const session = cookies.get(DHI_SESSION)
  if (session?.access_token) {
    queryParams = { ...queryParams, access_token: session.access_token }
  }
  const searchParams = new URLSearchParams(queryParams)
  return `${
    process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL
  }/assets/${id}?${searchParams.toString()}`
}
