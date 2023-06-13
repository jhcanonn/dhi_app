import { Metadata } from 'next';
import '@styles/globals.scss';
import { Providers } from '@components/templates';
import { Aside, Footer, Header } from '@components/organisms';

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
