import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import { ProfileForm } from '@/components/ProfileForm';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Profile() {
  return (
    <DashboardLayout type={LayoutType.investor}>
      <ProfileForm />
    </DashboardLayout>
  );
});
