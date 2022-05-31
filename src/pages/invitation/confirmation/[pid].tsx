import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '@firebase/auth';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

function Invitation() {
  const [user] = useAuthState(getAuth(app));
  const router = useRouter();
  const auth = getAuth(app);

  if (user) {
    router.push(`/visitor/diligence/${router.query.pid}`);
  }

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          router.push(`/visitor/diligence/${router.query.pid}`);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className=" mt-10 w-96 rounded border-1 border-slate-500 bg-slate-50 p-8">
        <div className="mb-5 font-bold text-slate-600">Confirmar e-mail</div>
        <div className="flex">Logando...</div>
      </div>
    </div>
  );
}

export default Invitation;
