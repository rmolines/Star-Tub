import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { AiOutlineClose } from 'react-icons/ai';

import DeleteDialog from '@/components/DeleteDialog';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function MyInvestors() {
  const { user, error, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [companies, loading, error2] = useCollection(
    query(
      collection(getFirestore(app), 'emailsShared'),
      where('uid', '==', user !== undefined ? user?.sub : 'qwer')
    )
  );

  const removeUser = async (shareId: string) => {
    await deleteDoc(doc(getFirestore(app), 'emailsShared', shareId));
  };

  return (
    <DashboardLayout type={LayoutType.founder}>
      <div className="flex flex-col">
        {companies?.docs.length === 0 && (
          <div className="flex justify-center">
            <div className="text-center">
              Você ainda não compartilhou seu espaço com ninguém!
            </div>
          </div>
        )}
        <div className="my-6 flex flex-wrap justify-between gap-4 pt-4">
          {(error || error2) && <strong>Error: {JSON.stringify(error)}</strong>}
          {(isLoading || loading) && <span>Loading...</span>}
          {companies?.docs.map((docShadow) => (
            <div key={docShadow.id}>
              <div className="flex items-center gap-3 rounded-md border-1 border-slate-400 bg-slate-100 px-4 py-2">
                {docShadow.data().email}
                <div
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  <AiOutlineClose className="cursor-pointer" />
                </div>
              </div>
              <DeleteDialog
                setIsOpen={setIsOpen}
                isOpen={isOpen}
                user={docShadow.data().email}
                removeUser={() => removeUser(docShadow.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
});
