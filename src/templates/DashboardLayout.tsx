import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { AiOutlineForm } from 'react-icons/ai';
import { BiArrowBack, BiFace, BiLogOut } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';

import { useUserInfo } from '@/context/UserInfoContext';
import { Meta } from '@/layout/Meta';

export enum LayoutType {
  founder,
  investor,
  diligence,
  visitor,
}

type IMainProps = {
  children: ReactNode;
  type: LayoutType;
  menuProps?: any;
};

const founderMenuItems = [
  {
    href: '/founder/questions/',
    title: 'Perguntas',
    icon: <AiOutlineForm />,
  },
  {
    href: '/founder/company/',
    title: 'Empresa',
    icon: <BsBriefcase />,
  },
  // {
  //   href: '/founder/myinvestors/',
  //   title: 'Investidores',
  //   icon: <BsPeople />,
  // },
];

const investorMenuItems = [
  {
    href: '/investor/companies/',
    title: 'Empresas',
    icon: <BsBriefcase />,
  },
  // {
  //   href: '/investor/fund/',
  //   title: 'Fundo',
  //   icon: <BsCurrencyDollar />,
  // },
];

const DashboardLayout = (props: IMainProps) => {
  const router = useRouter();
  const { userInfo } = useUserInfo();

  const [showSideBar, setShowSideBar] = useState(false);

  const menuItems = {
    [LayoutType.founder]: founderMenuItems,
    [LayoutType.investor]: investorMenuItems,
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
          } transition-transform duration-300 h-screen border-r-1 border-slate-200 bg-slate-50 p-2 md:w-60 md:translate-x-0 z-10`}
        >
          <nav>
            <ul>
              <li className="flex items-center space-x-2  p-4 text-slate-900">
                <BiFace className="hidden h-12 w-12 rounded-full dark:bg-gray-500 md:flex" />
                <div>
                  {userInfo && userInfo?.data() && (
                    <h2 className="font-semibold lg:text-lg">
                      {`${userInfo?.data().firstName} ${
                        userInfo?.data().lastName
                      }`}
                    </h2>
                  )}
                  <span className="flex items-center space-x-1">
                    <Link href={'profile/'} className="border-0 no-underline">
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
                  <Link href={href}>
                    <a
                      onClick={() => {
                        setShowSideBar(false);
                      }}
                      className={`${
                        router.asPath === href
                          ? 'bg-slate-200 text-slate-800'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                      } p-2 flex rounded cursor-pointer border-none`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="ml-2 text-lg">{icon}</span>
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
                <Link href={'/api/auth/logout/'}>
                  <a
                    onClick={() => {
                      setShowSideBar(false);
                    }}
                    className={`${'bg-slate-50 hover:bg-slate-100 text-slate-600'} p-2 flex rounded cursor-pointer border-none`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="ml-2 text-lg">
                        <BiLogOut />
                      </span>
                      <div>Logout</div>
                    </div>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-full antialiased md:ml-60">
          <div className="mx-auto h-screen max-w-screen-md">
            {/* Children */}
            <div className="content">
              <div className="mb-4 flex items-center gap-2 px-4 pt-5">
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
