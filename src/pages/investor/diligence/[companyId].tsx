import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  addDoc,
  collection,
  DocumentData,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Diligence() {
  const [answeredQuestions, setAnsweredQuestions] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

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

  const createQuestion = async (question: String) => {
    await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: router.query.companyId,
    });
    setCreatingQuestion(false);
  };

  useEffect(() => {
    if (!loading && value) {
      setAnsweredQuestions(
        value.docs.filter((doc) => doc.data().answer !== '')
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
        </div>
      </div>

      {/* Caixa para criar pergunta */}
      {creatingQuestion && (
        <div className="my-6 mx-2 border-b-1 border-slate-200 pb-4">
          <div className="font-semibold">Nova pergunta</div>
          <span>
            <NewQuestion
              submitFunc={createQuestion}
              cancelFunc={setCreatingQuestion}
            />
          </span>
        </div>
      )}

      {/* Perguntas respondidas */}
      {answeredQuestions.length > 0 && (
        <span>
          {answeredQuestions.map((docShadow, index) => (
            <QuestionBox
              key={docShadow.id}
              id={docShadow.id}
              index={index}
              question={docShadow.data().question}
              answer={docShadow.data().answer}
              unanswered={false}
            />
          ))}
        </span>
      )}
    </DashboardLayout>
  );
});
