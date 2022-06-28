import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

import { ProfileForm } from '../../../components/ProfileForm';

export default withPageAuthRequired(function Profile() {
  return (
    <DashboardLayout type={LayoutType.founder}>
      <ProfileForm />
    </DashboardLayout>
  );
});
