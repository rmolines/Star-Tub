import { getAuth } from '@firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { Meta } from '@/layout/Meta';
import { DiligenceLayout } from '@/templates/DiligenceLayout';

const Diligence = () => {
  // const router = useRouter();
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [user] = useAuthState(getAuth(app));
  const router = useRouter();

  const [company] = useDocument(
    doc(
      getFirestore(app),
      'users',
      Object.keys(router.query).length === 0 ? 'aa' : router.query.companyId
    )
  );

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
      setUnansweredQuestions(
        value.docs.filter((doc) => doc.data().answer === '')
      );
    }
  }, [value]);

  if (!loading && !error && user == null) {
    router.push('/auth');
  }

  return (
    <DiligenceLayout
      companyName={company?.data() ? company.data().empresa : ''}
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <h1 className="text-2xl font-bold">Perguntas</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}

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

      {creatingQuestion && (
        <NewQuestion
          submitFunc={createQuestion}
          cancelFunc={setCreatingQuestion}
          uid={user?.uid}
        />
      )}

      <div className="flex justify-end">
        <button
          className="h-12 w-12 rounded-full bg-green-600 text-2xl text-white"
          onClick={() => {
            setCreatingQuestion(true);
          }}
        >
          +
        </button>
      </div>
    </DiligenceLayout>
  );
};

export default Diligence;
