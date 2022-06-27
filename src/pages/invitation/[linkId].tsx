import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { uuid } from 'uuidv4';

import LoadingSpinner from '@/components/LoadingSpinner';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

function Invitation() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [hasAccess, setHasAccess] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [success, setSuccess] = useState(false);

  const verifyEmail = async (emailText: string) => {
    setSendingEmail(true);
    const verificationLink = uuid();

    const res = await getDocs(
      query(
        collection(getFirestore(app), 'users'),
        where('linkId', '==', router.query.linkId)
      )
    );

    const emailsShared = await getDocs(
      query(
        collection(getFirestore(app), 'emailsShared'),
        where('uid', '==', res.docs[0]?.id),
        where('email', '==', emailText)
      )
    );

    if (!emailsShared.docs[0]?.exists) {
      setHasAccess(false);
      setSendingEmail(false);
    } else {
      await setDoc(
        doc(getFirestore(app), 'verificationLinks', verificationLink),
        {
          email: emailText,
          redirectLink: router.query.linkId,
        }
      );

      await fetch('/api/sendgrid', {
        body: JSON.stringify({
          subject: 'Verifique seu e-mail',
          to: emailText,
          html: `http://localhost:3000/invitation/confirmation/${verificationLink}`,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });
      setSendingEmail(false);
      setSuccess(true);
    }
  };

  return (
    <div className="flex justify-center">
      <LoadingSpinner isOpen={sendingEmail} />
      {!hasAccess ? (
        <DashboardLayout type={LayoutType.diligence}>
          <span>Você não tem permissão para acessar essa página!</span>
        </DashboardLayout>
      ) : (
        <div className=" mt-10 w-96 rounded border-1 border-slate-500 bg-white px-8 py-6">
          {success ? (
            <div className="mb-6 font-bold text-slate-700">
              E-mail enviado, verifique sua caixa de entrada!
            </div>
          ) : (
            <>
              <div className="mb-6 font-bold text-slate-700">
                Confirmar e-mail
              </div>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Invitation;
