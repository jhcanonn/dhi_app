import { Metadata } from 'next';
import { Providers } from '@components/templates';
import { Aside, Footer, Header } from '@components/organisms';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@styles/globals.scss';

export const metadata: Metadata = {
  title: 'DHI | Home',
  description: 'DHI home page',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <Providers>
          <Header />
          <main className="flex flex-col grow mt-16">
            <Aside />
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
