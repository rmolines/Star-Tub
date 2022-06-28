import { Dialog } from '@headlessui/react';
import { Dispatch, SetStateAction } from 'react';

export default function DeleteUserDialog(props: {
  removeUser: () => void;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog
      open={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="flex flex-col rounded bg-white p-8 text-sm font-semibold text-slate-700 shadow">
          <Dialog.Title className="mb-6 flex items-center">
            Tem certeza que deseja deletar seu usuário?
          </Dialog.Title>
          <div className="flex justify-end">
            <button
              className="ml-2 rounded bg-red-600 px-4 py-2 text-white"
              onClick={() => {
                props.setIsOpen(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="ml-2 rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => {
                props.removeUser();
              }}
            >
              Remover
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
