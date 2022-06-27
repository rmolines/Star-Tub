import '../styles/global.css';

import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';

import { UserInfoProvider } from '@/context/UserInfoContext';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <UserProvider>
    <UserInfoProvider>
      <Component {...pageProps} />
    </UserInfoProvider>
  </UserProvider>
);

export default MyApp;
