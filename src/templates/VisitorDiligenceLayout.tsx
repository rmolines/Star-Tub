import { getAuth } from '@firebase/auth';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { AppConfig } from '@/utils/AppConfig';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  companyName: string;
};

const VisitorDiligenceLayout = (props: IMainProps) => {
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

export { VisitorDiligenceLayout };
