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
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

const Diligence = () => {
  // const router = useRouter();
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const router = useRouter();

  const [userInfo] = useCollection(
    query(
      collection(getFirestore(app), 'users'),
      where('linkId', '==', router.query.linkId ? router.query.linkId : 'ss')
    )
  );

  const [companyInfo] = useDocument(
    doc(
      getFirestore(app),
      'companies',
      userInfo !== undefined ? userInfo.docs[0].data().companyId : 'as'
    )
  );

  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'questions'),
      where(
        'companyId',
        '==',
        userInfo !== undefined ? userInfo.docs[0].data().companyId : 'as'
      )
    )
  );

  const createQuestion = async (question: String) => {
    await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: userInfo?.docs[0].data().companyId,
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

  return (
    <DashboardLayout
      type={LayoutType.visitor}
      menuProps={{
        companyName: companyInfo?.data() ? companyInfo?.data().name : '',
      }}
    >
      <div className="flex items-center justify-between">
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}

        <h1 className="text-2xl font-bold">Perguntas</h1>
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
              uid={'visitor'}
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
};

export default Diligence;
