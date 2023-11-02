'use client'

import { Providers } from '@components/templates'
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.scss'
import '@styles/globals.scss'
import NProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BlockUI } from 'primereact/blockui'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const [blocked, setBlocked] = useState<boolean>(false)

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickle: true,
      trickleSpeed: 200,
      minimum: 0.08,
      easing: 'ease',
      speed: 200,
      template:
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="" role="spinner"><div class="spinner-icon"></div></div>',
    })
  }, [])

  useEffect(() => {
    NProgress.done()
    NProgress.remove()
    setBlocked(false)
    return () => {
      NProgress.start()
    }
  }, [pathname])

  return (
    <html lang='en'>
      <body className='flex flex-col justify-center'>
        <BlockUI blocked={blocked} fullScreen />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
