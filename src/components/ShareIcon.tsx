import { Dispatch, SetStateAction } from 'react';
import { BsShare } from 'react-icons/bs';

type Props = {
  setAction: Dispatch<SetStateAction<boolean>>;
};

function ShareIcon(props: Props) {
  return (
    <div
      onClick={() => props.setAction(true)}
      className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center rounded-full text-sm"
    >
      <BsShare className="text-xl font-semibold text-slate-600" />
    </div>
  );
}

export default ShareIcon;
