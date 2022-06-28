import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

import { useUserInfo } from '@/context/UserInfoContext';

export default withPageAuthRequired(function Index() {
  const { user } = useUser();
  const { userInfo, loading, firebaseError, auth0Error } = useUserInfo();

  useEffect(() => {
    // console.log(
    //   userInfo?.data(),
    //   userInfo?.exists(),
    //   user,
    //   user?.sub,
    //   loading,
    //   firebaseError,
    //   auth0Error
    // );
    if (user?.sub && !loading && !firebaseError && !auth0Error) {
      const getUser = async () => {
        if (userInfo === undefined || !userInfo.exists()) {
          router.push('/registration/completeRegistration');
        } else if (userInfo.data().userType === 'founder') {
          router.push('/founder/questions/');
        } else {
          router.push('/investor/companies/');
        }
      };
      getUser();
    }
  }, [user, loading, firebaseError, auth0Error]);

  return <Fragment />;
});
