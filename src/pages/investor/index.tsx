import { collection, getFirestore, query, where } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';

import { Meta } from '@/layout/Meta';
import { InvestorLayout } from '@/templates/InvestorLayout';

function Investor() {
  const router = useRouter();
  const [companies, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'users'),
      where('tipo', '==', 'founder')
    )
  );

  return (
    <InvestorLayout
      investors={false}
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <div className="flex">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {companies?.docs.map((doc) => (
          <button
            className="cursor-pointer rounded-md border-2 border-slate-400 bg-slate-100 px-4 py-2"
            key={doc.id}
            onClick={() => {
              router.push(`/investor/diligence/${doc.id}`);
            }}
          >
            {doc.data().empresa}
          </button>
        ))}
      </div>
    </InvestorLayout>
  );
}

export default Investor;
