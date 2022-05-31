import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

function CardFooter(props: Props) {
  return (
    <div className={'rounded-b-lg bg-white py-2 px-6'}>{props.children}</div>
  );
}

CardFooter.propTypes = {};

export default CardFooter;
