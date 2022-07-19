import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

import { useUserInfo } from '@/context/UserInfoContext';

export default withPageAuthRequired(function Index() {
  const { userInfo, loading, auth0Error, companyInfo } = useUserInfo();

  useEffect(() => {
    if (!loading && !auth0Error && userInfo && companyInfo) {
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
  }, [loading, auth0Error, userInfo, companyInfo]);

  return <Fragment />;
});
