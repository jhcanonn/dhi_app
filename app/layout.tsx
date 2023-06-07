import { Metadata } from 'next';
import { Aside, Footer, Header, Providers } from '@components';
import '@styles/globals.scss';

export const metadata: Metadata = {
  title: 'DHI | Home',
  description: 'DHI home page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}
