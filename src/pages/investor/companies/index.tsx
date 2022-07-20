import { withPageAuthRequired } from '@auth0/nextjs-auth0';

import Companies from '@/components/pages/Companies';

export default withPageAuthRequired(Companies);
