import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import router from 'next/router';
import { Fragment, useEffect } from 'react';

export default withPageAuthRequired(function Index() {
  const { user, error, isLoading } = useUser();

  const getUser = async () => {
    const userInfo = await getDoc(doc(getFirestore(app), 'users', user.sub));

    if (userInfo === undefined || !userInfo.exists()) {
      router.push('completeRegistration');
    } else if (userInfo.data().userType === 'founder') {
      router.push('founder');
    } else {
      router.push('investor');
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return <Fragment />;
});
