import { useUser } from '@auth0/nextjs-auth0';
import { doc, FirestoreError, getFirestore } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { createContext, ReactNode, useContext } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

// TODO melhorar defaults and merge user and userinfo contexts

type UserInfoType = {
  userInfo: any;
  loading: boolean;
  error: FirestoreError | undefined;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  loading: true,
  error: undefined,
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userInfo, loading, error] = useDocument(
    doc(getFirestore(app), `users/${user?.sub}`)
  );

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        loading,
        error,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
