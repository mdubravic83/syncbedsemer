import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({
  isCmsAdmin: false,
  setIsCmsAdmin: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isCmsAdmin, setIsCmsAdmin] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem('cmsAdmin') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('cmsAdmin', isCmsAdmin ? '1' : '0');
    } catch {
      // ignore
    }
  }, [isCmsAdmin]);

  return (
    <AuthContext.Provider value={{ isCmsAdmin, setIsCmsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
