import 'firebase/compat/auth';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { getAuth } from '@firebase/auth';
import firebase from 'firebase/compat/app';
import { app } from 'firebaseConfig';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

export default withPageAuthRequired(function FounderPage() {
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    signInSuccessUrl: `/founderpage/`,
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        requireDisplayName: false,
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(app)} />;
});
