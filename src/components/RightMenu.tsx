import { useRouter } from 'next/router';
import { forwardRef } from 'react';
import { RiLogoutBoxRLine, RiProfileLine } from 'react-icons/ri';

const RightMenu = forwardRef(function RightMenu(props, ref) {
  const router = useRouter();

  return (
    <div
      ref={ref}
      className="absolute right-0 top-11 z-50 flex w-32 flex-col justify-start rounded-lg border-1 border-slate-500 bg-white shadow-lg"
    >
      <button
        onClick={() => {
          router.push('/profile');
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
          router.push('/api/auth/logout');
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
});

export default RightMenu;
