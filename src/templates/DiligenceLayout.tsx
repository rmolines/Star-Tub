import { getAuth } from '@firebase/auth';
import { app } from 'firebaseConfig';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BiArrowBack } from 'react-icons/bi';
import { BsPersonCircle } from 'react-icons/bs';

import RightMenu from '@/components/RightMenu';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  companyName: string;
};

const DiligenceLayout = (props: IMainProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, loading, error] = useAuthState(getAuth(app));
  const router = useRouter();

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      {props.meta}

      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {user && (
        <div className="mx-auto max-w-screen-md">
          <div className="border-b border-gray-300">
            <div className="px-2 pt-4 pb-2">
              <div className="flex justify-between">
                <ul className="relative flex flex-wrap items-center text-xl">
                  <li className="mr-6">
                    {/* <Link href="/"> */}
                    <a
                      onClick={() => {
                        router.back();
                      }}
                      className="cursor-pointer border-none text-gray-700 hover:text-gray-900"
                    >
                      <div className="rounded-full border-2 border-slate-400 bg-slate-100 p-2 hover:bg-slate-300">
                        <BiArrowBack className="" />
                      </div>
                    </a>
                    {/* </Link> */}
                  </li>
                  <li className="mr-6">
                    <Link href="/about/">
                      <a className="border-none text-gray-700 hover:text-gray-900">
                        {props.companyName}
                      </a>
                    </Link>
                    {props.investors && (
                      <div className="mx-auto w-full border-2 border-slate-300" />
                    )}
                  </li>
                </ul>
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
                </button>{' '}
                {showMenu && <RightMenu />}
              </div>
            </div>
          </div>

          <div className="content py-5 text-xl">{props.children}</div>

          <div className="border-t border-gray-300 py-8 text-center text-sm">
            © Copyright {new Date().getFullYear()} {AppConfig.title}. Powered by{' '}
            <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>
            {/*
             * PLEASE READ THIS SECTION
             * We'll really appreciate if you could have a link to our website
             * The link doesn't need to appear on every pages, one link on one page is enough.
             * Thank you for your support it'll mean a lot for us.
             */}
          </div>
        </div>
      )}
    </div>
  );
};

export { DiligenceLayout };
