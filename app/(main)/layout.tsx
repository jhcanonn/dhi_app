import { Aside, Footer, Header } from '@components/organisms'

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className='flex flex-col grow mt-16'>
      <Aside />
      {children}
    </main>
    <Footer />
  </>
)

export default MainLayout
