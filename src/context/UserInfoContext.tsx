import { useUser } from '@auth0/nextjs-auth0';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

// TODO melhorar defaults and merge user and userinfo contexts

type UserInfoType = {
  userInfo: any;
  setUserInfo: (userInfo: any) => void;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  setUserInfo: (_userInfo) => {},
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [userInfo, setUserInfo] =
    useState<DocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      if (user) {
        const userInfoShadow = await getDoc(
          doc(
            getFirestore(app),
            'users',
            typeof user?.sub === 'string' ? user?.sub : ''
          )
        );
        setUserInfo(userInfoShadow);
      }
    };

    getUserInfo();
  }, [user]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        setUserInfo: (userInfoShadow) => {
          setUserInfo(userInfoShadow);
        },
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
