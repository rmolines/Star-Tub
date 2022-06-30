import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import { AiOutlineForm } from 'react-icons/ai';
import { BiArrowBack, BiFace, BiLogOut } from 'react-icons/bi';
import { BsBriefcase } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi';
import { TbBusinessplan } from 'react-icons/tb';

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
  {
    href: '/founder/funds/',
    title: 'Fundos',
    icon: <TbBusinessplan />,
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
  {
    href: '/investor/funds/',
    title: 'Fundos',
    icon: <TbBusinessplan />,
  },
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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Meta
        title="Clam"
        description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
      />
      <div className="relative flex w-screen max-w-screen-xl items-center justify-center md:flex-row">
        <aside
          className={`${
            showSideBar ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 h-screen md:w-72 md:translate-x-0 z-10 fixed left-0 md:relative md:bg-white bg-neutral-200`}
        >
          <nav className="sticky top-0 p-6">
            <ul className="">
              <li className="mb-8 flex items-center gap-2 text-neutral-900">
                <BiFace className="hidden h-12 w-12 rounded-full dark:bg-slate-500 md:flex" />
                <div>
                  {userInfo && userInfo?.data() && (
                    <h2 className="font-semibold ">
                      {`${userInfo?.data().firstName} ${
                        userInfo?.data().lastName
                      }`}
                    </h2>
                  )}
                  <span className="flex items-center space-x-1">
                    <Link href={'profile/'} className="border-0 no-underline">
                      <div className="cursor-pointer border-0 text-xs text-slate-500 no-underline dark:text-slate-400">
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
                <li className="ml-2 mb-4" key={title}>
                  <Link href={href}>
                    <div
                      className={`${
                        router.asPath === href ? '' : ''
                      } flex rounded`}
                    >
                      <a
                        onClick={() => {
                          setShowSideBar(false);
                        }}
                        className="flex cursor-pointer items-center space-x-4 border-none text-sm text-neutral-900"
                      >
                        <span className="text-2xl">{icon}</span>
                        <div>{title}</div>
                      </a>
                    </div>
                  </Link>
                </li>
              ))}
              <li className="border-t-1 border-neutral-200" key={'Logout'}>
                <Link href={'/api/auth/logout/'}>
                  <div className={`flex rounded ml-2 mt-4`}>
                    <a
                      onClick={() => {
                        setShowSideBar(false);
                      }}
                      className="flex cursor-pointer items-center space-x-4 border-none text-sm text-neutral-900"
                    >
                      <span className="g-slate-400 text-2xl">
                        <BiLogOut />
                      </span>
                      <div>Logout</div>
                    </a>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-full antialiased">
          <div className="mx-auto h-screen">
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
              <div className="h-full px-4">{props.children}</div>
            </div>

            {/* Footer */}
            {/* <div className="sticky border-t border-slate-300 py-8 text-center text-sm">
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
