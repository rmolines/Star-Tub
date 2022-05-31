import { getAuth } from '@firebase/auth';
import { app } from 'firebaseConfig';
import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsPersonCircle } from 'react-icons/bs';

import RightMenu from '@/components/RightMenu';
import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  investors: boolean;
};

const FounderLayout = (props: IMainProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [user, loading, error] = useAuthState(getAuth(app));

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
                <ul className="relative flex flex-wrap text-xl">
                  <li className="mr-6">
                    <Link href="/founder">
                      <a className="border-none text-gray-700 hover:text-gray-900">
                        Minhas Perguntas
                      </a>
                    </Link>
                    {!props.investors && (
                      <div className="mx-auto w-full border-1 border-slate-300" />
                    )}
                  </li>
                  <li className="mr-6">
                    <Link href="/founder/myinvestors">
                      <a className="border-none text-gray-700 hover:text-gray-900">
                        Meus Investidores
                      </a>
                    </Link>
                    {props.investors && (
                      <div className="mx-auto w-full border-1 border-slate-300" />
                    )}
                  </li>
                </ul>
                <button
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                  className="relative"
                >
                  <BsPersonCircle className="cursor-pointer text-4xl text-slate-500 hover:text-slate-600" />
                  {/* <div className=" flex h-10 w-10 justify-center rounded-full border-2 border-slate-600 bg-slate-300 text-center align-middle text-2xl text-slate-600">
                    R
                  </div> */}
                  {showMenu && <RightMenu setShowMenu={setShowMenu} />}
                </button>{' '}
              </div>
            </div>
          </div>

          {/* Children */}
          <div className="content py-5 px-4 text-xl">{props.children}</div>

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

export { FounderLayout };
