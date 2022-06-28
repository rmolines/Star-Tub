import { useUser } from '@auth0/nextjs-auth0';
import { doc, FirestoreError, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

// TODO melhorar defaults and merge user and userinfo contexts

type UserInfoType = {
  userInfo: any;
  loading: boolean;
  firebaseError: FirestoreError | undefined;
  auth0Error: Error | undefined;
  signedIn: boolean;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  loading: true,
  firebaseError: undefined,
  auth0Error: undefined,
  signedIn: false,
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user, error: auth0Error, isLoading: auth0Loading } = useUser();
  const [userInfo, firbaseLoading, firebaseError] = useDocument(
    doc(getFirestore(app), `users/${user?.sub}`)
  );
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (typeof user !== 'undefined') {
      setSignedIn(true);
    }
  }, [user]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        loading: firbaseLoading || auth0Loading,
        firebaseError,
        auth0Error,
        signedIn,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
