import Image from 'next/image'

const ComingSoon = ({ page }: { page: string }) => (
  <section className='grow flex justify-center items-center flex-col gap-3'>
    <h1 className='font-bold text-center text-2xl md:text-4xl'>
      {`Página `}
      <i>{`'${page}'`}</i>
    </h1>
    <Image
      className='object-contain'
      src='/assets/coming-soon.png'
      alt='Comming soon'
      width={300}
      height={300}
    />
  </section>
)

export default ComingSoon
