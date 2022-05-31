import { getAuth, sendSignInLinkToEmail } from '@firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { DiligenceLayout } from '@/templates/DiligenceLayout';

function Invitation() {
  const [user] = useAuthState(getAuth(app));
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [hasAccess, setHasAccess] = useState(true);

  const verifyEmail = async (emailText: string) => {
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `http://localhost:3000/invitation/confirmation/${router.query.pid}`,
      // This must be true.
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(getAuth(app), emailText, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', emailText);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        // ...
      });
  };

  const checkExistingUser = async () => {
    const userInfo = await getDocs(
      query(
        collection(getFirestore(app), 'users'),
        where('linkId', '==', router.query.pid)
      )
    );
    const sharedUser = await getDocs(
      query(
        collection(getFirestore(app), 'emailsShared'),
        where('uid', '==', userInfo.docs[0].id),
        where('email', '==', user?.email.toLowerCase())
      )
    );
    if (sharedUser && sharedUser.docs.length > 0) {
      router.push(`/visitor/diligence/${router.query.pid}`);
    } else {
      setHasAccess(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkExistingUser();
    }
  }, [user]);

  return (
    <div className="flex justify-center">
      {!hasAccess ? (
        <DiligenceLayout>
          <span>Você não tem permissão para acessar essa página!</span>
        </DiligenceLayout>
      ) : (
        <div className=" mt-10 w-96 rounded border-1 border-slate-500 bg-white px-8 py-6">
          <div className="mb-6 font-bold text-slate-700">Confirmar e-mail</div>
          <div className="flex">
            <input
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              type="email"
              className="h-10 w-full rounded border-1 border-slate-300 bg-slate-50 pl-2"
              placeholder="Digite seu e-mail..."
            />
            <button
              onClick={() => {
                verifyEmail(email);
              }}
              className="ml-2 h-10 cursor-pointer rounded bg-blue-600 px-3 text-white"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invitation;
