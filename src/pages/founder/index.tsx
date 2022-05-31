import { getAuth } from '@firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { BsPlusCircle } from 'react-icons/bs';
import { uuid } from 'uuidv4';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import ShareIcon from '@/components/ShareIcon';
import { FounderLayout } from '@/templates/FounderLayout';

import { ShareDialog } from '../../components/ShareDialog';

function FounderPage() {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [user] = useAuthState(getAuth(app));
  const [userInfo] = useDocument(
    doc(getFirestore(app), 'users', user !== null ? user.uid : 'qwer')
  );
  const [createdLink, setCreatedLink] = useState(false);
  const [link, setLink] = useState('');

  const [value, loading, error] = useCollection(
    query(
      collection(getFirestore(app), 'questions'),
      where('companyId', '==', user ? user?.uid : '')
    )
  );

  const createQuestion = async (question: String, uid: string) => {
    const res = await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: uid,
    });
    console.log(res.id);
    setCreatingQuestion(false);
  };

  const createLink = async () => {
    const links = await getDocs(
      query(
        collection(getFirestore(app), 'emailsShared'),
        where('uid', '==', user?.uid),
        where('email', '==', email.toLowerCase())
      )
    );

    if (links && links.docs.length > 0) {
      setLink(`http://localhost:3000/invitation/${userInfo?.data().linkId}`);
    } else {
      await addDoc(collection(getFirestore(app), 'emailsShared'), {
        uid: user?.uid,
        email: email.toLowerCase(),
      });
      let linkId = '';
      if (!userInfo?.data().linkId) {
        linkId = uuid();
        await updateDoc(doc(getFirestore(app), 'users', user?.uid), {
          linkId,
        });
      } else {
        linkId = userInfo?.data().linkId;
      }
      setLink(`http://localhost:3000/invitation/${linkId}`);
    }
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
    <FounderLayout investors={false}>
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

      {/* Perguntas não respondidas */}
      {unansweredQuestions.length > 0 && (
        <div className="my-8 border-t-1 border-slate-200 pt-4">
          <h2 className="text-lg font-semibold">Não Respondidas</h2>
          <span>
            {unansweredQuestions.map((doc, index) => (
              <QuestionBox
                key={doc.id}
                index={index}
                id={doc.id}
                question={doc.data().question}
                answer={doc.data().answer}
                unanswered={true}
              />
            ))}
          </span>
        </div>
      )}
    </FounderLayout>
  );
}

export default FounderPage;
