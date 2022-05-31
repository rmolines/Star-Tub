import { getAuth, signOut } from '@firebase/auth';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { RiLogoutBoxRLine, RiProfileLine } from 'react-icons/ri';

type Props = {
  setShowMenu: (arg0: boolean) => void;
};

function RightMenu(props: Props) {
  const router = useRouter();
  const profileMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenu.current && !profileMenu.current.contains(event.target)) {
        props.setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <div
      ref={profileMenu}
      className="absolute right-0 top-11 z-50 flex w-32 flex-col justify-start rounded-lg border-1 border-slate-500 bg-white shadow-lg"
    >
      <button
        onClick={() => {
          router.push('profile');
        }}
        className="cursor-pointer rounded-t-lg hover:bg-slate-50"
      >
        <div className="flex items-center justify-start pt-2 pb-1">
          <RiProfileLine className="mr-2 ml-4" />
          Profile
        </div>
      </button>
      <button
        onClick={() => {
          signOut(getAuth(app));
          router.push('auth');
        }}
        className="cursor-pointer rounded-b-lg hover:bg-slate-50"
      >
        <div className="flex items-center justify-start pb-2 pt-1">
          <RiLogoutBoxRLine className="mr-2 ml-4" />
          Logout
        </div>
      </button>
    </div>
  );
}

export default RightMenu;
