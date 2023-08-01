'use client'

import { Cookies, withCookies } from 'react-cookie'
import Nav from './Nav'
import { jwtVerify } from 'jose'
import { DHI_SESSION } from '@utils'
import { useEffect, useState } from 'react'

const Header = ({ cookies }: { cookies: Cookies }) => {
  const [userId, setUserId] = useState('')

  const verifyToken = async () => {
    const session = cookies.get(DHI_SESSION)
    if (session) {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_DIRECTUS_SECRET_TOKEN,
      )
      const { payload } = await jwtVerify(session.access_token, secret)
      setUserId(payload.id + '')
    }
  }

  useEffect(() => {
    verifyToken()
  }, [])

  return (
    <header className='layout-topbar'>
      <Nav userId={userId} />
    </header>
  )
}

export default withCookies(Header)
