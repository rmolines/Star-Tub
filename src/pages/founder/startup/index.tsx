import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useState } from 'react';

import LoadingSpinner from '@/components/LoadingSpinner';
import { StartupForm } from '@/components/StartupForm';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { registerFounder } from '@/utils/functions';

import { StartupFormValues } from '../../../types/companyTypes';

export default withPageAuthRequired(function Company() {
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useUser();

  const onSubmit = (data: StartupFormValues) => {
    if (user?.sub) {
      setIsOpen(true);
      registerFounder(data, user?.sub).then(() => {
        setSuccess(true);
        setIsOpen(false);
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
      <LoadingSpinner isOpen={isOpen} />
    </DashboardLayout>
  );
});
