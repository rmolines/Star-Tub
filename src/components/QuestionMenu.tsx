import React, { useEffect, useRef } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

export function QuestionMenu(props: {
  setShowEditMenu: (arg0: boolean) => void;
  showEditMenu: any;
  setEditing: (arg0: boolean) => void;
  deleteQuestion: (arg0: any) => void;
  id: any;
}) {
  const editMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editMenu.current && !editMenu.current.contains(event.target)) {
        props.setShowEditMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="hover:cursor-pointer"
        onClick={() => props.setShowEditMenu(!props.showEditMenu)}
      >
        <BsThreeDotsVertical className="stroke-1 text-sm text-slate-600" />
      </button>
      {props.showEditMenu && (
        <div
          ref={editMenu}
          className="absolute right-10 top-10 flex-col justify-center rounded-lg border-1 border-slate-500 bg-white text-sm"
        >
          <div
            className="w-full cursor-pointer rounded-t-lg border-b-1 border-slate-400 py-1 px-4  hover:bg-slate-100"
            onClick={() => {
              props.setEditing(true);
              props.setShowEditMenu(false);
            }}
          >
            Editar
          </div>
          <div
            className="w-full cursor-pointer rounded-b-lg py-1 px-4 hover:bg-slate-100"
            onClick={() => props.deleteQuestion(props.id)}
          >
            Deletar
          </div>
        </div>
      )}
    </div>
  );
}
