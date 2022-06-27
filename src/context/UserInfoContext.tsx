import { createContext, ReactNode, useContext, useState } from 'react';

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
  const [userInfo, setUserInfo] = useState({});

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
