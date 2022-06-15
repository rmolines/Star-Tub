import { useEffect, useRef, useState } from 'react';
import { BsPersonCircle } from 'react-icons/bs';

import RightMenu from '@/components/RightMenu';

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const profileMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenu.current && !profileMenu.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  return (
    <button
      onClick={() => {
        setShowMenu(!showMenu);
      }}
      className="relative"
    >
      <BsPersonCircle className="mr-2 cursor-pointer text-4xl text-slate-500 hover:text-slate-600" />
      {/* <div className=" flex h-10 w-10 justify-center rounded-full border-2 border-slate-600 bg-slate-300 text-center align-middle text-2xl text-slate-600">
             R
           </div> */}
      {showMenu && <RightMenu ref={profileMenu} />}
    </button>
  );
};

export default ProfileButton;
