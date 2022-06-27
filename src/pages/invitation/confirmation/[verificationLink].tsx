import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Invitation() {
  const router = useRouter();
  const { verificationLink } = router.query;

  const confirmLink = async () => {
    const res = await getDoc(
      doc(
        getFirestore(app),
        'verificationLinks',
        typeof verificationLink === 'string' ? verificationLink : ''
      )
    );

    if (res.exists()) {
      const linkRes = await getDocs(
        query(
          collection(getFirestore(app), 'users'),
          where('linkId', '==', res.data().redirectLink)
        )
      );
      router.push(`/visitor/diligence/${linkRes.docs[0]?.data().linkId}`);
    }
  };

  useEffect(() => {
    if (router.query.verificationLink) {
      confirmLink();
    }
  }, [router.query]);

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
