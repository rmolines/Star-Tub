import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useState } from 'react';

import { FundForm } from '@/components/FundForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { FundFormValues } from '@/types/companyTypes';
import { registerInvestor } from '@/utils/functions';

export default withPageAuthRequired(function Company() {
  const { user } = useUser();
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (data: FundFormValues) => {
    if (user?.sub) {
      setIsOpen(true);
      registerInvestor(data, user?.sub).then(() => {
        setSuccess(true);
        setIsOpen(false);
      });
    }
  };

  return (
    <DashboardLayout type={LayoutType.investor}>
      {user && (
        <div className="mt-8 px-8 sm:px-20">
          <FundForm fillInfo onSubmit={onSubmit} />
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
