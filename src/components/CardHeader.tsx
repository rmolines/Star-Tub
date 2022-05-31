import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function CardHeader(props: Props) {
  return (
    <div className="flex items-start justify-between rounded-t-lg border-b-1 border-slate-500 bg-slate-100 p-4 py-3">
      {props.children}
    </div>
  );
}

CardHeader.propTypes = {};

export default CardHeader;
