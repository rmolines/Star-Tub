export default function VisitorLayout({ setShowMenu, showMenu }) {
  return (
    <div className="flex justify-between">
      <ul className="relative flex flex-wrap items-center text-xl">
        <li className="mr-6">{props.companyName}</li>
      </ul>
      <button
        onClick={() => {
          setShowMenu(!showMenu);
        }}
        className="relative rounded bg-orange-600 px-4 py-2 text-white"
      >
        Signup
      </button>{' '}
    </div>
  );
}
