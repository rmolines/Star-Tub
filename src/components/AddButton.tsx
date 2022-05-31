import { Dispatch, SetStateAction } from 'react';

type Props = {
  setAction: Dispatch<SetStateAction<boolean>>;
};

function AddButton(props: Props) {
  return (
    <button
      className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-2xl text-white"
      onClick={() => {
        props.setAction(true);
      }}
    >
      <div className="table-cell origin-center items-center">+</div>
    </button>
  );
}

export default AddButton;
