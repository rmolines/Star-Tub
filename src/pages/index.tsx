import { useUser } from '@auth0/nextjs-auth0';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

export default function Index() {
  const { user } = useUser();
  // const { setUserInfo } = useUserInfo();

  const getUser = async () => {
    // const userInfo = await getDoc(
    //   doc(
    //     getFirestore(app),
    //     'users',
    //     typeof user?.sub === 'string' ? user?.sub : ''
    //   )
    // );
    router.push('/api/auth/login');

    // if (userInfo === undefined || !userInfo.exists()) {
    //   router.push('/api/auth/login');
    // } else {
    //   setUserInfo(userInfo);
    //   if (userInfo.data().userType === 'founder') {
    //     router.push('/founder/questions/');
    //   } else {
    //     router.push('/investor/companies/');
    //   }
    // }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
    getUser();
  }, []);

  return <Fragment />;
}
