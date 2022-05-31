type Props = { onClick: () => void };

export default function MainButton(props: Props) {
  return (
    <button
      onClick={() => {
        props.onClick();
      }}
      className="ml-2 rounded bg-blue-600 px-4 text-white"
    >
      Gerar Link
    </button>
  );
}
