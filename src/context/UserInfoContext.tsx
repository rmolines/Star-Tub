import { useUser } from '@auth0/nextjs-auth0';
import { doc, FirestoreError, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { app } from 'firebaseConfig';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

import { StartupSimpleFormValues } from '@/types/companyTypes';

// TODO melhorar defaults and merge user and userinfo contexts

type UserInfoType = {
  userInfo: any;
  companyInfo: any;
  loading: boolean;
  firebaseError: FirestoreError | undefined;
  fbCompanyError: FirestoreError | undefined;
  auth0Error: Error | undefined;
  signedIn: boolean;
  logoURL: string;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  companyInfo: null,
  loading: true,
  firebaseError: undefined,
  fbCompanyError: undefined,
  auth0Error: undefined,
  signedIn: false,
  logoURL: '',
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export const StartupInfoContext = createContext<StartupSimpleFormValues>({
  name: '',
  url: '',
  linkedin: '',
  stage: null,
  thesis: null,
  setData: () => {},
});

export function useStartupInfo() {
  return useContext(StartupInfoContext);
}

export function StartupInfoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState({
    name: '',
    url: '',
    linkedin: '',
    stage: null,
    thesis: null,
  });

  return (
    <StartupInfoContext.Provider
      value={{
        ...data,
        setData,
      }}
    >
      {children}
    </StartupInfoContext.Provider>
  );
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user, error: auth0Error, isLoading: auth0Loading } = useUser();
  const [userInfo, firbaseLoading, firebaseError] = useDocument(
    doc(getFirestore(app), `users/${user?.sub}`)
  );
  const [companyInfo, fbCompanyLoading, fbCompanyError] = useDocument(
    doc(
      getFirestore(app),
      userInfo?.get('userType') === 'investor'
        ? `funds/${userInfo?.get('companyId')}`
        : `companies/${userInfo?.get('companyId')}`
    )
  );
  const [signedIn, setSignedIn] = useState(false);
  const [logoURL, setLogoURL] = useState('');

  useEffect(() => {
    if (typeof user !== 'undefined') {
      setSignedIn(true);
    }
  }, [user]);

  useEffect(() => {
    if (companyInfo && companyInfo.get('logoPath')) {
      const getLogoURL = async () => {
        const iconRef = ref(getStorage(), companyInfo.get('logoPath'));
        getDownloadURL(iconRef).then((URL) => setLogoURL(URL));
      };
      getLogoURL();
    }
  }, [companyInfo]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        companyInfo,
        loading: firbaseLoading || auth0Loading || fbCompanyLoading,
        firebaseError,
        fbCompanyError,
        auth0Error,
        signedIn,
        logoURL,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
