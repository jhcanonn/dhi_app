import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='layout-footer'>
      <Image
        src='/assets/logo-secondary.png'
        alt='DHI Logo'
        width={60}
        height={50}
        className='object-contain'
      />
      <span className='font-medium text-sm ml-2'>
        by <i>DHI</i>
      </span>
    </footer>
  )
}

export default Footer
