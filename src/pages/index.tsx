import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

import { useUserInfo } from '@/context/UserInfoContext';

export default withPageAuthRequired(function Index() {
  const {
    userInfo,
    loading,
    firebaseError,
    auth0Error,
    signedIn,
    companyInfo,
  } = useUserInfo();

  useEffect(() => {
    // TODO fix logic
    if (signedIn && !loading && !firebaseError && !auth0Error) {
      const getUser = async () => {
        if (
          userInfo === undefined ||
          !userInfo.exists() ||
          !companyInfo.exists()
        ) {
          router.push('/registration/completeRegistration');
        } else if (userInfo.data().userType === 'founder') {
          router.push('/founder/funds/');
        } else {
          router.push('/investor/companies/');
        }
      };
      getUser();
    }
  }, [signedIn, loading, firebaseError, auth0Error]);

  return <Fragment />;
});
