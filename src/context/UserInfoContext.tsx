import { useUser } from '@auth0/nextjs-auth0';
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
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
  companyInfo: any;
  loading: boolean;
  auth0Error: Error | undefined;
  logoURL: string;
};

const UserInfoContext = createContext<UserInfoType>({
  userInfo: null,
  companyInfo: null,
  loading: true,
  auth0Error: undefined,
  logoURL: '',
});

export function useUserInfo() {
  return useContext(UserInfoContext);
}

export function UserInfoProvider({ children }: { children: ReactNode }) {
  const { user, error: auth0Error, isLoading: auth0Loading } = useUser();

  const [logoURL, setLogoURL] = useState('');
  const [userInfo, setUserInfo] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const [companyInfo, setCompanyInfo] =
    useState<DocumentSnapshot<DocumentData> | null>(null);

  const getInfo = async (userSub: string) => {
    const tempUser = await getDoc(doc(getFirestore(app), 'users', userSub));
    const tempCompany = await getDoc(
      doc(
        getFirestore(app),
        tempUser.get('userType') === 'investor'
          ? `funds/${tempUser.get('companyId')}`
          : `companies/${tempUser.get('companyId')}`
      )
    );
    setUserInfo(tempUser);
    setCompanyInfo(tempCompany);

    const iconRef = ref(getStorage(), tempCompany.get('logoPath'));
    if (iconRef.name) {
      const tempURL = await getDownloadURL(iconRef);
      setLogoURL(tempURL);
    }
  };

  useEffect(() => {
    if (typeof user !== 'undefined' && user.sub) {
      getInfo(user.sub);
    }
  }, [user]);

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        companyInfo,
        logoURL,
        loading: auth0Loading,
        auth0Error,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}
