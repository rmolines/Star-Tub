import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function Card(props: Props) {
  return (
    <div className={'m-2 mt-4 rounded-lg border-1 border-slate-500 bg-white'}>
      {props.children}
    </div>
  );
}

export default Card;
