'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserBiometrics {
  height: number;
  weight: number;
  age: number;
  isSynced: boolean;
}

interface BioSyncContextType {
  userBio: UserBiometrics;
  updateBio: (newBio: Partial<UserBiometrics>) => void;
}

const BioSyncContext = createContext<BioSyncContextType | undefined>(undefined);

export const BioSyncProvider = ({ children }: { children: ReactNode }) => {
  const [userBio, setUserBio] = useState<UserBiometrics>({
    height: 175, // Default/Average
    weight: 70,
    age: 28,
    isSynced: false
  });

  const updateBio = (newBio: Partial<UserBiometrics>) => {
    setUserBio(prev => ({ ...prev, ...newBio, isSynced: true }));
  };

  return (
    <BioSyncContext.Provider value={{ userBio, updateBio }}>
      {children}
    </BioSyncContext.Provider>
  );
};

export const useBioSync = () => {
  const context = useContext(BioSyncContext);
  if (!context) {
    throw new Error('useBioSync must be used within a BioSyncProvider');
  }
  return context;
};
