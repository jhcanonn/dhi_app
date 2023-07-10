import { Login } from '@components/templates';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DHI | Login',
};

const LoginPage = () => <Login />;

export default LoginPage;
