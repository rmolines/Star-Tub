import { getAuth } from '@firebase/auth';
import { collection, getFirestore, query, where } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Meta } from '@/layout/Meta';
import { FounderLayout } from '@/templates/FounderLayout';

function MyInvestors() {
  const router = useRouter();
  const [user] = useAuthState(getAuth(app));
  const [companies, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'shareableLinks'),
      where('uid', '==', user?.uid)
    )
  );

  return (
    <FounderLayout
      investors={true}
      meta={
        <Meta
          title="Star Tub"
          description="One-stop-shop for your startup needs"
        />
      }
    >
      <div className="flex flex-col">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {companies?.docs.length === 0 && (
          <div className="flex justify-center">
            <div className="text-center">
              Você ainda não compartilhou seu espaço com ninguém!
            </div>
          </div>
        )}
        {companies?.docs.map((doc) => (
          <div key={doc.id} className="flex">
            <button
              className="cursor-pointer rounded-md border-2 border-slate-400 bg-slate-100 px-4 py-2"
              onClick={() => {}}
            >
              {doc.data().email}
            </button>
          </div>
        ))}
      </div>
    </FounderLayout>
  );
}

export default MyInvestors;
