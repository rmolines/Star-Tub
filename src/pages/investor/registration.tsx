import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { EVCFForm } from '@/components/EVCFForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EVCFFormValues } from '@/types/companyTypes';
import { registerEVCF } from '@/utils/functions';

export default withPageAuthRequired(function CompleteRegistration() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = (data: EVCFFormValues) => {
    if (user?.sub) {
      setIsOpen(true);
      registerEVCF(data, user?.sub).then(() =>
        router.push('/investor/companies/')
      );
    }
  };

  return (
    <div className="flex h-screen justify-center bg-slate-100 p-4">
      <div className="my-10 h-fit w-fit max-w-2xl rounded bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className="text-2xl font-semibold text-slate-800">
            Finalize seu cadastro!
          </h1>
        </div>
        <EVCFForm onSubmit={onSubmit} />
      </div>
      <LoadingSpinner isOpen={isOpen} />
    </div>
  );
});
