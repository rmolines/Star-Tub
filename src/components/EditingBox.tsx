import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import dynamic from 'next/dynamic';
// Import React dependencies.
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import Card from './Card';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';

const Editor = dynamic(() => import('./Editor'), {
  ssr: false,
});

type Props = {
  question: String;
  answer: String;
  id: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditingBox = (props: Props) => {
  const [answer, setAnswer] = useState(props.answer);
  const [question, setQuestion] = useState(props.question);

  const updateQuestion = async (
    id: string,
    answerText: String,
    questionText: String
  ) => {
    await updateDoc(doc(getFirestore(app), 'questions', id), {
      answer: answerText,
      question: questionText,
    });
    props.setEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <TextareaAutosize
          className={`w-full border-0 border-b-1 border-slate-300 bg-slate-100 pb-2 text-sm font-semibold text-slate-800`}
          defaultValue={`${props.question}`}
          onChange={(e) => {
            setQuestion(e.target.value);
          }}
        />
      </CardHeader>
      <CardFooter>
        <Editor
          disabled={false}
          editing
          onChange={(value) => setAnswer(value)}
          data={props.answer}
        />
      </CardFooter>
      <div className="flex justify-end p-4">
        <button
          className="rounded-md bg-red-700 px-2 py-1 text-slate-50"
          onClick={() => props.setEditing(false)}
        >
          Cancelar
        </button>
        <button
          className="ml-2 rounded-md bg-slate-500 px-2 py-1 text-slate-50"
          onClick={() => updateQuestion(props.id, answer, question)}
        >
          Enviar
        </button>
      </div>
    </Card>
  );
};

export { EditingBox };
