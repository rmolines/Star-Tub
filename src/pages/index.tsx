import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

import { useUserInfo } from '@/context/UserInfoContext';

export default withPageAuthRequired(function Index() {
  const { user } = useUser();
  const { setUserInfo } = useUserInfo();

  const getUser = async () => {
    const userInfo = await getDoc(
      doc(
        getFirestore(app),
        'users',
        typeof user?.sub === 'string' ? user?.sub : ''
      )
    );

    if (userInfo === undefined || !userInfo.exists()) {
      router.push('/registration/completeRegistration');
    } else {
      setUserInfo(userInfo);
      if (userInfo.data().userType === 'founder') {
        router.push('/founder/questions/');
      } else {
        router.push('/investor/companies/');
      }
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  return <Fragment />;
});
