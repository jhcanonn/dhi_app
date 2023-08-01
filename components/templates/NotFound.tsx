'use client'

import { PAGE_PATH } from '@utils'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'primereact/button'

const NotFound = () => {
  return (
    <section className='grow flex justify-center items-center flex-col gap-3'>
      <h1 className='font-bold text-4xl'>404 Pagina no encontrada</h1>
      <Image
        className='object-contain'
        src='/assets/coming-soon.png'
        alt='Comming soon'
        width={300}
        height={300}
      />
      <Link href={PAGE_PATH.home}>
        <Button className='p-button-outlined p-button-secondary'>
          Ir a home
        </Button>
      </Link>
    </section>
  )
}

export default NotFound
