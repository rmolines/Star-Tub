import { ReactNode, useState } from 'react';

import { Meta } from '@/layout/Meta';
import { AppConfig } from '@/utils/AppConfig';

import VisitorLayout from './VisitorLayout';

type IMainProps = {
  meta?: ReactNode;
  children: ReactNode;
  companyName: string;
};

const VisitorDiligenceLayout = (props: IMainProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="w-full px-1 text-gray-700 antialiased">
      <Meta
        title="Next.js Boilerplate Presentation"
        description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
      />
      <div className="mx-auto max-w-screen-md">
        <div className="border-b border-gray-300">
          <div className="px-2 pt-4 pb-2">
            <VisitorLayout setShowMenu={setShowMenu} showMenu={showMenu} />
          </div>
        </div>

        <div className="content py-5 text-xl">{props.children}</div>

        <div className="border-t border-gray-300 py-8 text-center text-sm">
          © Copyright {new Date().getFullYear()} {AppConfig.title}. Powered by{' '}
          <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>
          {/*
           * PLEASE READ THIS SECTION

    function VisitorLayout({setShowMenu, showMenu}) {
      return (<div className="flex justify-between">
              <ul className="relative flex flex-wrap items-center text-xl">
                <li className="mr-6">{props.companyName}</li>
              </ul>
              <button onClick={() => {
    setShowMenu(!showMenu);
  }} className="relative rounded bg-orange-600 px-4 py-2 text-white">
                Signup
              </button>{' '}
            </div>);
    }
             * We'll really appreciate if you could have a link to our website
           * The link doesn't need to appear on every pages, one link on one page is enough.
           * Thank you for your support it'll mean a lot for us.
           */}
        </div>
      </div>
    </div>
  );
};

export { VisitorDiligenceLayout };
