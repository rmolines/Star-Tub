import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { collection, getFirestore, query, where } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';

import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Investor() {
  const router = useRouter();
  const [companies, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'users'),
      where('tipo', '==', 'founder')
    )
  );

  return (
    <DashboardLayout type={LayoutType.investor}>
      <div className="flex">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {companies?.docs.map((doc) => (
          <button
            className="cursor-pointer rounded-md border-2 border-slate-400 bg-slate-100 px-4 py-2"
            key={doc.id}
            onClick={() => {
              router.push(`/diligence/${doc.id}`);
            }}
          >
            {doc.data().empresa}
          </button>
        ))}
      </div>
    </DashboardLayout>
  );
});
