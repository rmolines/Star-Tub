import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
// Import React dependencies.
import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import Card from './Card';
import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import Editor from './Editor';
import { QuestionMenu } from './QuestionMenu';

type Props = {
  question: String;
  answer: String;
  id: string;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
};

const AnsweredBox = (props: Props) => {
  const [showEditMenu, setShowEditMenu] = useState(false);

  const deleteQuestion = async (id: string) => {
    await deleteDoc(doc(getFirestore(app), 'questions', id));
  };

  return (
    <Card>
      <CardHeader>
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
      </CardHeader>
      <CardFooter>
        <Editor onChange={() => {}} disabled data={props.answer} />
      </CardFooter>
    </Card>
  );
};

export { AnsweredBox };
