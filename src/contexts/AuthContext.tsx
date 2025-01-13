import { createContext, useContext } from 'react';
import useAuth, { UseAuthResult } from '../hooks/useAuth.ts';
import useSubscriptions from '../hooks/useSubscriptions.ts';

const AuthContext = createContext<UseAuthResult | null>(null);

export const AuthProvider = ({ children }: any) => {
  const auth = useAuth();

  console.log('Access Token:', auth);

  useSubscriptions(auth.accessToken);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
