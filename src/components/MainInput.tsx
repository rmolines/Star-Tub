import {
  DetailedHTMLProps,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
} from 'react';

type Props = {
  changeHandler: (arg0: string) => void;
  type: HTMLInputTypeAttribute | undefined;
  placeholder?: string | undefined;
  defaultValue?: string;
};

export function MainInput(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <input
      type={props.type}
      defaultValue={props.defaultValue}
      placeholder={props.placeholder}
      className="rounded border-2 border-slate-300 py-2 pr-32 pl-2"
      onChange={(event) => {
        props.onChange(event.target.value);
      }}
    />
  );
}
