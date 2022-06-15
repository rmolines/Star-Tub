import { Dialog } from '@headlessui/react';
import { ImSpinner8 } from 'react-icons/im';

function LoadingSpinner(props: { isOpen: boolean }) {
  return (
    <Dialog open={props.isOpen} onClose={() => {}} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel  */}
        <Dialog.Panel>
          <div className="animate-spin text-5xl text-white">
            <ImSpinner8 />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default LoadingSpinner;
