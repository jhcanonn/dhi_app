import { Aside, Footer, Header } from '@components/organisms';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@styles/globals.scss';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    <main className="flex flex-col grow mt-16">
      <Aside />
      {children}
    </main>
    <Footer />
  </>
);

export default MainLayout;
