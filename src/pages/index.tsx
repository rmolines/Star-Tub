import { getAuth } from '@firebase/auth';
import { signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const Index = () => {
  // const router = useRouter();
  const [user, loading, error] = useAuthState(getAuth(app));
  const router = useRouter();

  const getUser = async () => {
    if (!loading && !error && user == null) {
      router.push('auth');
    } else if (user != null) {
      const userInfo = await getDoc(doc(getFirestore(app), 'users', user.uid));
      console.log(userInfo.data());

      if (userInfo === undefined || userInfo.data() === undefined) {
        signOut(getAuth(app));
      } else if (
        userInfo.data().firstName === '' ||
        userInfo.data().lastName === '' ||
        userInfo.data().companyName === '' ||
        userInfo.data().userType === '' ||
        userInfo.data().firstName === undefined ||
        userInfo.data().lastName === undefined ||
        userInfo.data().companyName === undefined ||
        userInfo.data().userType === undefined
      ) {
        router.push('completeRegistration');
      } else if (userInfo.data().userType === 'founder') {
        router.push('founder');
      } else {
        router.push('investor');
      }
    }
  };

  getUser();

  return <Fragment />;
};

export default Index;
