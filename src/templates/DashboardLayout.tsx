import { useUser } from '@auth0/nextjs-auth0';
import { doc, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { AiOutlineForm } from 'react-icons/ai';
import { BiArrowBack, BiFace, BiLogOut } from 'react-icons/bi';
import { FaUserFriends } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';

import { Meta } from '@/layout/Meta';

export enum LayoutType {
  founder,
  investor,
  profile,
  diligence,
  visitor,
}

type IMainProps = {
  children: ReactNode;
  type: LayoutType;
  menuProps?: any;
};

function FounderMenuItems() {
  return (
    <ul className="relative flex flex-wrap text-xl">
      <li className="mr-6">
        <Link href="/founder">
          <a className="border-none text-gray-700 hover:text-gray-900">
            Minhas Perguntas
          </a>
        </Link>
      </li>
      <li className="mr-6">
        <Link href="/founder/myinvestors">
          <a className="border-none text-gray-700 hover:text-gray-900">
            Meus Investidores
          </a>
        </Link>
      </li>
    </ul>
  );
}

const founderMenuItems = [
  {
    href: '/founder/',
    title: 'Perguntas',
    icon: <AiOutlineForm />,
  },
  {
    href: '/founder/myinvestors/',
    title: 'Investidores',
    icon: <FaUserFriends />,
  },
];

function VisitorMenuItems(props: { companyName: string }) {
  return (
    <ul className="relative flex flex-wrap items-center text-xl">
      <li className="mr-6">{props.companyName}</li>
    </ul>
  );
}

function InvestorMenuItems() {
  return (
    <ul className="relative flex flex-wrap text-xl">
      <li className="mr-6">
        <Link href="/">
          <a className="border-none text-gray-700 hover:text-gray-900">
            Minhas Empresas
          </a>
        </Link>
      </li>
    </ul>
  );
}

function ProfileMenuItems(props: { back: () => void }) {
  return (
    <ul className="relative flex flex-wrap items-center text-xl">
      <li className="mr-6">
        <a
          onClick={() => {
            props.back();
          }}
          className="cursor-pointer border-none text-gray-700 hover:text-gray-900"
        >
          <div className="rounded-full border-2 border-slate-400 bg-slate-100 p-2 hover:bg-slate-300">
            <BiArrowBack className="" />
          </div>
        </a>
      </li>
    </ul>
  );
}

function DiligenceMenuItems(props: { back: () => void }) {
  return (
    <ul className="relative flex flex-wrap items-center text-xl">
      <li className="mr-6">
        <a
          onClick={() => {
            props.back();
          }}
          className="cursor-pointer border-none text-gray-700 hover:text-gray-900"
        >
          <div className="rounded-full border-2 border-slate-400 bg-slate-100 p-2 hover:bg-slate-300">
            <BiArrowBack className="" />
          </div>
        </a>
      </li>
    </ul>
  );
}

const DashboardLayout = (props: IMainProps) => {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [userInfo] = useDocument(
    doc(getFirestore(app), 'users', user?.sub ?? 'aa')
  );

  const [showSideBar, setShowSideBar] = useState(false);

  const menuItems = {
    [LayoutType.founder]: founderMenuItems,
    [LayoutType.investor]: founderMenuItems,
    [LayoutType.profile]: founderMenuItems,
    [LayoutType.diligence]: founderMenuItems,
    [LayoutType.visitor]: founderMenuItems,
  }[props.type];

  return (
    <div className="flex min-h-screen flex-col">
      <Meta
        title="Clam"
        description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
      />
      <div className="relative flex md:flex-row">
        <aside
          className={`fixed ${
            showSideBar ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 h-screen border-r-1 border-slate-200 bg-slate-50 p-2 md:w-72 md:translate-x-0 md:relative`}
        >
          <nav>
            <ul>
              <li className="flex items-center space-x-2  p-4 text-slate-900">
                <BiFace className="hidden h-12 w-12 rounded-full dark:bg-gray-500 md:flex" />
                <div>
                  <h2 className="font-semibold lg:text-lg">
                    {`${userInfo?.data().firstName} ${
                      userInfo?.data().lastName
                    }` ?? ''}
                  </h2>
                  <span className="flex items-center space-x-1">
                    <Link href={'/profile/'} className="border-0 no-underline">
                      <div className="cursor-pointer border-0 text-xs text-slate-500 no-underline dark:text-gray-400">
                        View profile
                      </div>
                    </Link>
                  </span>
                </div>
                {showSideBar && (
                  <button
                    onClick={() => {
                      setShowSideBar(false);
                    }}
                    className="ml-6 text-xl md:hidden"
                  >
                    <BiArrowBack />
                  </button>
                )}
              </li>
              {menuItems.map(({ href, title, icon }) => (
                <li className="m-2" key={title}>
                  <Link
                    href={href}
                    onClick={() => {
                      setShowSideBar(false);
                    }}
                  >
                    <a
                      className={`${
                        router.asPath === href
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      } p-2 flex rounded cursor-pointer border-none`}
                    >
                      <div className="flex items-center gap-2">
                        {icon}
                        <div>{title}</div>
                      </div>
                    </a>
                  </Link>
                </li>
              ))}
              <li
                className="m-2 border-t-1 border-slate-200 pt-2"
                key={'Logout'}
              >
                <Link
                  href={'/api/auth/logout/'}
                  onClick={() => {
                    setShowSideBar(false);
                  }}
                >
                  <a
                    className={`${'bg-slate-50 hover:bg-slate-100 text-slate-600'} p-2 flex rounded cursor-pointer border-none`}
                  >
                    <div className="flex items-center gap-2">
                      <BiLogOut />
                      <div>Logout</div>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-full antialiased">
          <div className="mx-auto h-screen max-w-screen-md">
            {/* Children */}
            <div className="content">
              <div className="flex items-center gap-2 px-4 pt-5">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setShowSideBar(true);
                  }}
                >
                  <GiHamburgerMenu className="text-2xl md:hidden" />
                </button>
                <h1 className="text-2xl font-semibold">
                  {
                    menuItems.filter((item) => item.href === router.asPath)[0]
                      ?.title
                  }
                  {router.asPath === '/profile/' && 'Profile'}
                </h1>
              </div>
              <div className="px-4">{props.children}</div>
            </div>

            {/* Footer */}
            {/* <div className="sticky border-t border-gray-300 py-8 text-center text-sm">
              © Copyright {new Date().getFullYear()} {AppConfig.title}. Powered
              by{' '}
              <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>
              {/*
               * PLEASE READ THIS SECTION
               * We'll really appreciate if you could have a link to our website
               * The link doesn't need to appear on every pages, one link on one page is enough.
               * Thank you for your support it'll mean a lot for us.
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
