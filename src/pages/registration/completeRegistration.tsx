import { useUser } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { FundForm } from '@/components/FundForm';
import { FundFormValues, StartupFormValues } from '@/types/companyTypes';
import { registerFounder, registerInvestor } from '@/utils/functions';

import { StartupForm } from '../../components/StartupForm';

function CompleteRegistration() {
  const [userType, setUserType] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = (data: FundFormValues) => {
    if (user?.sub) {
      registerInvestor(data, user?.sub).then(() => router.push('/'));
    }
  };

  return (
    <div className="flex h-screen justify-center bg-slate-50 p-4">
      <div className="my-10 h-fit w-full min-w-fit max-w-xl rounded bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className=" text-xl font-semibold text-slate-700">
            Complete Registration
          </h1>
        </div>

        <div className="mt-6 flex justify-center">
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
        </div>

        {userType ? (
          <StartupForm
            onSubmit={(data: StartupFormValues) => {
              if (user?.sub) {
                registerFounder(data, user?.sub).then(() => router.push('/'));
              }
            }}
            fillInfo={false}
          />
        ) : (
          <FundForm onSubmit={onSubmit} />
        )}
      </div>
    </div>
  );
}

export default CompleteRegistration;
