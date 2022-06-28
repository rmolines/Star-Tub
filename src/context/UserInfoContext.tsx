import { useUser } from '@auth0/nextjs-auth0';
import { doc, FirestoreError, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

// TODO melhorar defaults and merge user and userinfo contexts

type UserInfoType = {
  userInfo: any;
  loading: boolean;
  firebaseError: FirestoreError | undefined;
  auth0Error: Error | undefined;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  loading: true,
  firebaseError: undefined,
  auth0Error: undefined,
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user, error: auth0Error, isLoading: auth0Loading } = useUser();
  const [userInfo, firbaseLoading, firebaseError] = useDocument(
    doc(getFirestore(app), `users/${user?.sub}`)
  );

  useEffect(() => {
    console.log(user, user?.sub, userInfo?.data());
  }, [user]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        loading: firbaseLoading || auth0Loading,
        firebaseError,
        auth0Error,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
