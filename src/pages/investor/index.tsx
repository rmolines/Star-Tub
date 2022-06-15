import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Dialog } from '@headlessui/react';
import {
  addDoc,
  collection,
  doc,
  documentId,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { userInfo } from 'os';
import { useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';
import { uuid } from 'uuidv4';

import MainButton from '@/components/MainButton';
import { ShareDialog } from '@/components/ShareDialog';
import ShareIcon from '@/components/ShareIcon';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Investor() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [createdLink, setCreatedLink] = useState(false);
  const [link, setLink] = useState('');
  const [companies, loading, error2] = useCollection(
    query(
      collection(getFirestore(app), 'emailsShared'),
      where('email', '==', user !== undefined ? user.email : 'aa')
    )
  );
  const [companiesInfo] = useCollection(
    query(
      collection(getFirestore(app), 'companies'),
      where(
        documentId(),
        'in',
        companies?.docs && companies.docs.length > 0
          ? companies.docs.map((docData) => {
              return docData.data().companyId ? docData.data().companyId : 'aa';
            })
          : ['aa']
      )
    )
  );

  const createLink = async () => {
    const links = await getDocs(
      query(
        collection(getFirestore(app), 'emailsShared'),
        where('uid', '==', user?.sub),
        where('email', '==', email.toLowerCase())
      )
    );

    if (links && links.docs.length > 0) {
      setLink(`http://localhost:3000/invitation/${userInfo?.data().linkId}`);
    } else {
      await addDoc(collection(getFirestore(app), 'emailsShared'), {
        uid: user?.sub,
        email: email.toLowerCase(),
      });
      let linkId = '';
      if (!userInfo?.data().linkId) {
        linkId = uuid();
        await updateDoc(doc(getFirestore(app), 'users', user?.sub), {
          linkId,
        });
      } else {
        linkId = userInfo?.data().linkId;
      }
      setLink(`http://localhost:3000/invitation/${linkId}`);
    }

    setCreatedLink(true);
  };

  const createCompany = async (name: string) => {
    const company = await addDoc(collection(getFirestore(app), 'companies'), {
      name,
    });
    await addDoc(collection(getFirestore(app), 'emailsShared'), {
      email: user?.email,
      companyId: company.id,
    });
    setIsOpen2(false);
  };

  return (
    <DashboardLayout type={LayoutType.investor}>
      <div className="mb-2 flex items-center justify-end">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}

        <div className="flex items-center text-2xl">
          <BsPlusCircle
            onClick={() => {
              setIsOpen2(true);
            }}
            className="mr-4 cursor-pointer"
          />
          <ShareIcon setAction={setIsOpen}></ShareIcon>
        </div>
        <ShareDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setEmail={setEmail}
          createdLink={createdLink}
          link={link}
          createLink={createLink}
        />
      </div>
      <div className="flex">
        {(error || error2) && <strong>Error: {JSON.stringify(error)}</strong>}
        {(isLoading || loading) && <span>Loading...</span>}
        {companiesInfo?.docs.map((doc) => (
          <button
            className="cursor-pointer rounded-md border-2 border-slate-400 bg-slate-100 px-4 py-2"
            key={doc.id}
            onClick={() => {
              router.push(`/investor/diligence/${doc.id}`);
            }}
          >
            {doc.data().name}
          </button>
        ))}
      </div>

      <Dialog
        open={isOpen2}
        onClose={() => setIsOpen2(false)}
        className="relative z-50"
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container to center the panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="flex flex-col rounded-lg border-3 border-slate-300 bg-white p-8 text-sm font-semibold text-slate-700 shadow-xl">
            <Dialog.Title className="flex items-center">
              Digite o nome da empresa
            </Dialog.Title>
            <div className="my-4 flex">
              <input
                type="text"
                className="rounded border-2 border-slate-300 py-2 pl-2"
                onChange={(event) => setCompanyName(event.target.value)}
              />
              <MainButton
                onClick={() => {
                  createCompany(companyName);
                }}
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </DashboardLayout>
  );
});
