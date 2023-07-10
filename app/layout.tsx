import { Providers } from '@components/templates';
import 'primereact/resources/themes/bootstrap4-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '@styles/globals.scss';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
