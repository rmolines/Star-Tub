import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import error from 'next/error';
import { useEffect, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';
import { uuid } from 'uuidv4';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import ShareIcon from '@/components/ShareIcon';
import { useUserInfo } from '@/context/UserInfoContext';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

import { ShareDialog } from '../../../components/ShareDialog';

export default withPageAuthRequired(function Founder() {
  const [answeredQuestions, setAnsweredQuestions] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState<
    QueryDocumentSnapshot<DocumentData>[]
  >([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [createdLink, setCreatedLink] = useState(false);

  const { user } = useUser();
  const { userInfo } = useUserInfo();

  const [value, loading] = useCollection(
    query(
      collection(getFirestore(app), 'questions'),
      where('companyId', '==', userInfo ? userInfo.data().companyId : 'aa')
    )
  );

  useEffect(() => {
    if (!loading && value) {
      setAnsweredQuestions(
        value.docs.filter((docShadow) => docShadow.data().answer !== '')
      );
      setUnansweredQuestions(
        value.docs.filter((docShadow) => docShadow.data().answer === '')
      );
    }
  }, [value]);

  const createQuestion = async (question: String) => {
    setCreatingQuestion(false);
    await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: userInfo?.data().companyId,
    });
  };

  const createLink = async () => {
    const links = await getDocs(
      query(
        collection(getFirestore(app), 'emailsShared'),
        where('uid', '==', user?.sub),
        where('email', '==', email.toLowerCase())
      )
    );

    if (links && links.docs.length === 0) {
      await addDoc(collection(getFirestore(app), 'emailsShared'), {
        uid: user?.sub,
        email: email.toLowerCase(),
      });
    }

    let linkId = '';
    if (!userInfo?.data().linkId) {
      linkId = uuid();

      // TODO throw error when sub is undefined
      if (user?.sub) {
        await updateDoc(doc(getFirestore(app), 'users', user?.sub), {
          linkId,
        });
      }
    } else {
      linkId = userInfo?.data().linkId;
    }
    setLink(`http://localhost:3000/invitation/${linkId}`);

    setCreatedLink(true);
  };

  return (
    <DashboardLayout type={LayoutType.founder}>
      <div className="flex items-center justify-end">
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
          setCreatedLink={setCreatedLink}
        />
      </div>

      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
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

      {/* Perguntas não respondidas */}
      {unansweredQuestions.length > 0 && (
        <div className="my-8 border-t-1 border-slate-200 pt-4">
          <h2 className="text-lg font-semibold">Não Respondidas</h2>
          <span>
            {unansweredQuestions.map((docShadow, index) => (
              <QuestionBox
                key={docShadow.id}
                index={index}
                id={docShadow.id}
                question={docShadow.data().question}
                answer={docShadow.data().answer}
                unanswered={true}
              />
            ))}
          </span>
        </div>
      )}
    </DashboardLayout>
  );
});
