'use client'

import { ProgressSpinner } from 'primereact/progressspinner'

const LoadingSkeleton = ({ page }: { page: string }) => {
  return (
    <div className='grow flex justify-center items-center flex-col gap-12'>
      <h2 className='font-bold text-lg'>
        {`Cargando página `}
        <i>{`'${page}'...`}</i>
      </h2>
      <ProgressSpinner />
    </div>
  )
}

export default LoadingSkeleton
