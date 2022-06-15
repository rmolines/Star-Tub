import { Dialog } from '@headlessui/react';

export default function DeleteDialog(props: {
  isOpen: boolean | undefined;
  setIsOpen: (arg0: boolean) => void;
  removeUser: () => void;
  user: string;
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
        <Dialog.Panel className="flex flex-col rounded-lg border-1 border-slate-500 bg-white p-8 text-sm font-semibold text-slate-700 shadow-xl">
          <Dialog.Title className="flex items-center">
            Tem certeza que deseja remover o acesso do usuário {props.user}?
          </Dialog.Title>
          <div className="my-4 flex justify-end">
            <button
              className="ml-2 rounded bg-red-600 px-4 text-white"
              onClick={() => {
                props.setIsOpen(false);
              }}
            >
              Cancelar
            </button>
            <button
              className="ml-2 rounded bg-blue-600 px-4 text-white"
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
