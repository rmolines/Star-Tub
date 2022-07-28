import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';

export default withPageAuthRequired(function Index() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    const getInfo = async () => {
      if (user && user.sub) {
        const userInfo = await getDoc(
          doc(getFirestore(app), 'users', user.sub)
        );

        if (!userInfo.exists()) {
          router.push('/registration/completeRegistration/');
          return;
        }

        const companyInfo = await getDoc(
          doc(
            getFirestore(app),
            userInfo.get('userType') === 'investor' ? 'funds' : 'companies',
            userInfo.get('companyId')
          )
        );

        if (!companyInfo.exists()) {
          router.push('/registration/completeRegistration/');
          return;
        }

        if (userInfo.get('userType') === 'investor') {
          router.push('/investor/companies/');
        } else {
          router.push('/founder/funds/');
        }
      } else {
        router.push('/home');
      }
    };
    if (!isLoading) {
      getInfo();
    }
  }, [isLoading]);

  return <LoadingSpinner isOpen />;
});
