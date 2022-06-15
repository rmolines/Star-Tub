import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';
import { uuid } from 'uuidv4';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { ShareDialog } from '@/components/ShareDialog';
import ShareIcon from '@/components/ShareIcon';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Diligence() {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const { user, error2, isLoading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [createdLink, setCreatedLink] = useState(false);
  const router = useRouter();

  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'questions'),
      where(
        'companyId',
        '==',
        Object.keys(router.query).length === 0 ? '' : router.query.companyId
      )
    )
  );

  const [company] = useDocument(
    doc(
      getFirestore(app),
      'companies',
      router.query ? router.query.companyId : ''
    )
  );

  const createQuestion = async (question: String) => {
    await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: router.query.companyId,
    });
    setCreatingQuestion(false);
  };

  const createLink = async () => {
    await addDoc(collection(getFirestore(app), 'emailsShared'), {
      companyId: router.query.companyId,
      email: email.toLowerCase(),
    });
    let linkId = '';
    if (!company?.data().linkId) {
      linkId = uuid();
      await updateDoc(doc(getFirestore(app), 'companies', company?.id), {
        linkId,
      });
    } else {
      linkId = company?.data().linkId;
    }
    setLink(`http://localhost:3000/invitation/${linkId}`);

    setCreatedLink(true);
  };

  useEffect(() => {
    if (!loading && value) {
      setAnsweredQuestions(
        value.docs.filter((doc) => doc.data().answer !== '')
      );
      setUnansweredQuestions(
        value.docs.filter((doc) => doc.data().answer === '')
      );
    }
  }, [value]);

  return (
    <DashboardLayout type={LayoutType.diligence}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Perguntas</h1>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}

        <div className="flex items-center text-2xl">
          <BsPlusCircle
            onClick={() => {
              setCreatingQuestion(true);
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

      {/* Caixa para criar pergunta */}
      {creatingQuestion && (
        <div className="my-6 mx-2 border-b-1 border-slate-200 pb-4">
          <div className="font-semibold">Nova pergunta</div>
          <span>
            <NewQuestion
              submitFunc={createQuestion}
              cancelFunc={setCreatingQuestion}
              uid={user?.uid}
            />
          </span>
        </div>
      )}

      {/* Perguntas respondidas */}
      {answeredQuestions.length > 0 && (
        <span>
          {answeredQuestions.map((doc, index) => (
            <QuestionBox
              key={doc.id}
              id={doc.id}
              index={index}
              question={doc.data().question}
              answer={doc.data().answer}
              unanswered={false}
            />
          ))}
        </span>
      )}
    </DashboardLayout>
  );
});
