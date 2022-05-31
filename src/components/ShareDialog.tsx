import { Dialog } from '@headlessui/react';
import { BiCopy } from 'react-icons/bi';

import MainButton from './MainButton';

export function ShareDialog(props: {
  isOpen: boolean | undefined;
  setIsOpen: (arg0: boolean) => void;
  setEmail: (arg0: string) => void;
  createLink: () => void;
  createdLink: any;
  link: string;
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
            Compartilhar Q&A
          </Dialog.Title>
          <div className="my-4 flex">
            <input
              type="email"
              placeholder={'Digite o e-mail...'}
              className="rounded border-2 border-slate-300 py-2 pr-32 pl-2"
              onChange={(event) => props.setEmail(event.target.value)}
            />
            <MainButton onClick={props.createLink} />
          </div>
          {props.createdLink && (
            <div
              className="flex cursor-pointer items-center justify-start"
              onClick={() => {
                navigator.clipboard.writeText(props.link);
              }}
            >
              <span className="mr-1 text-ellipsis text-sm font-normal text-blue-700">
                Copy link
              </span>
              <BiCopy className="cursor-pointer text-blue-700" />
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
