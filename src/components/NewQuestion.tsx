import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

type Props = {
  submitFunc: (question: String, uid: string) => Promise<void>;
  cancelFunc: Dispatch<SetStateAction<boolean>>;
  uid: string;
};

const NewQuestion = (props: Props) => {
  const [question, setQuestion] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  return (
    <div className={'m-2 mt-4 rounded-lg border-1 border-slate-500'}>
      <div className="flex items-center justify-between rounded-t-lg border-b-1 border-slate-500 bg-slate-100 py-2 px-4">
        <TextareaAutosize
          className={`w-full border-b-1 pb-2 border-slate-300 bg-slate-100 text-sm font-semibold text-slate-800`}
          placeholder={'Escrever pergunta...'}
          onChange={(e) => setQuestion(e.target.value)}
          ref={inputRef}
          // onKeyPress={(e) => {
          //   if (e.key === 'Enter') {
          //     props.submitFunc(question, props.uid);
          //   }
          // }}
        />
      </div>
      <div className="flex justify-end p-4">
        <button
          className="rounded-md bg-red-700 px-2 py-1 text-slate-50"
          onClick={() => props.cancelFunc()}
        >
          Cancelar
        </button>
        <button
          className="ml-2 rounded-md bg-slate-400 px-2 py-1 text-slate-50"
          onClick={() => props.submitFunc(question, props.uid)}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export { NewQuestion };
