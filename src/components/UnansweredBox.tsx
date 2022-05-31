import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
// Import React dependencies.
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import Editor from './Editor';
import { QuestionMenu } from './QuestionMenu';

type Props = {
  question: String;
  answer: String;
  id: string;
  index: number;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const UnansweredBox = (props: Props) => {
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [answer, setAnswer] = useState(props.answer);
  const [showSendButton, setShowSendButton] = useState(false);

  const deleteQuestion = async (id: string) => {
    await deleteDoc(doc(getFirestore(app), 'questions', id));
  };

  const answerQuestion = async (id: string, answerText: String) => {
    await updateDoc(doc(getFirestore(app), 'questions', id), {
      answer: answerText,
    });
  };

  return (
    <div>
      <div className={'m-2 mt-4 rounded-lg border-1 border-slate-500'}>
        <div className="flex items-center justify-between rounded-t-lg border-b-1 border-slate-500 bg-slate-100 py-2 px-4">
          <TextareaAutosize
            readOnly
            className="w-full resize-none bg-slate-100 pt-1 text-sm font-bold text-slate-700 outline-none"
            defaultValue={`${props.index + 1}. ${props.question}`}
          />
          <QuestionMenu
            showEditMenu={showEditMenu}
            setShowEditMenu={setShowEditMenu}
            setEditing={props.setEditing}
            deleteQuestion={deleteQuestion}
            id={props.id}
          />
        </div>
        <div className={'rounded-b-lg bg-white p-6'}>
          <Editor
            onChange={(value) => setAnswer(value)}
            unanswered
            data={props.answer}
          />

          {showSendButton && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  answerQuestion(props.id, answer);
                }}
                className="mt-4 cursor-pointer rounded bg-slate-500 px-2 py-1 text-slate-50"
              >
                Enviar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnansweredBox;
