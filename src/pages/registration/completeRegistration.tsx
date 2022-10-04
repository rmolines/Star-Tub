import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { FundForm } from '@/components/FundForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FundFormValues, StartupFormValues } from '@/types/companyTypes';
import { registerFounder, registerInvestor } from '@/utils/functions';

import { StartupForm } from '../../components/StartupForm';

export default withPageAuthRequired(function CompleteRegistration() {
  const [userType] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = (data: FundFormValues) => {
    if (user?.sub) {
      setIsOpen(true);
      registerInvestor(data, user?.sub).then(() =>
        router.push('/investor/companies/')
      );
    }
  };

  return (
    <div className="flex h-screen justify-center bg-slate-50 p-4">
      <div className="my-10 h-fit w-fit max-w-2xl rounded bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center justify-between">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className=" text-xl font-semibold text-slate-700">
            Cadastre sua startup!
          </h1>
          {/* <button className="flex cursor-pointer items-center justify-between gap-2 rounded  bg-slate-600 px-2 py-1 text-sm text-white">
            Investidor
            <GoArrowRight />
          </button> */}
        </div>

        {/* <div className="mt-6 flex justify-center">
          <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Investor
          </span>
          <label
            htmlFor="large-toggle"
            className="relative inline-flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              id="large-toggle"
              className="peer sr-only"
              defaultChecked={userType}
              onChange={(e) => setUserType(e.target.checked)}
            />
            <div className="peer h-7 w-14 rounded-full bg-slate-400 after:absolute after:top-0.5 after:left-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          </label>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Founder
          </span>
        </div> */}

        {userType ? (
          <StartupForm
            onSubmit={(data: StartupFormValues) => {
              if (user?.sub) {
                setIsOpen(true);
                registerFounder(data, user.sub).then(() =>
                  router.push('/funds/')
                );
              }
            }}
            fillInfo={false}
          />
        ) : (
          <FundForm onSubmit={onSubmit} />
        )}
      </div>
      <LoadingSpinner isOpen={isOpen} />
    </div>
  );
});
