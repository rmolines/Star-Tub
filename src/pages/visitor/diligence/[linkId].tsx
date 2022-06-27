import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useEffect, useState } from 'react';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { useUserInfo } from '@/context/UserInfoContext';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

const Diligence = () => {
  // const router = useRouter();
  const [answeredQuestions, setAnsweredQuestions] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const { userInfo } = useUserInfo();

  const [companyInfo] = useDocument(
    doc(
      getFirestore(app),
      'companies',
      userInfo ? userInfo.docs[0].data().companyId : 'as'
    )
  );

  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'questions'),
      where(
        'companyId',
        '==',
        userInfo ? userInfo.docs[0].data().companyId : 'as'
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
        value.docs.filter((docShadow) => docShadow.data().answer !== '')
      );
    }
  }, [value]);

  return (
    <DashboardLayout
      type={LayoutType.visitor}
      menuProps={{
        companyName: companyInfo?.data()?.name,
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
};

export default Diligence;
