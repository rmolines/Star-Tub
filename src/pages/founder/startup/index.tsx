import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { StartupForm } from '@/components/StartupForm';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { registerFounder } from '@/utils/functions';

import { StartupFormValues } from '../../../types/companyTypes';

export default withPageAuthRequired(function Company() {
  const [success, setSuccess] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = (data: StartupFormValues) => {
    if (user?.sub) {
      registerFounder(data, user?.sub).then(() => {
        setSuccess(true);
        router.reload();
      });
    }
  };

  return (
    <DashboardLayout type={LayoutType.founder}>
      {user && (
        <div className="mt-8 lg:px-20">
          <StartupForm fillInfo onSubmit={onSubmit} />
          {success && (
            <span className="mt-2 w-fit rounded text-sm font-semibold">
              Perfil atualizado com sucesso!
            </span>
          )}
        </div>
      )}
    </DashboardLayout>
  );
});
