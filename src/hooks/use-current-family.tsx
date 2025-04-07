'use client';

import { createContext, useContext } from 'react';
import { Family } from '@prisma/client';

export const CurrentFamilyContext = createContext<Family | null>(null);

export const CurrentFamilyProvider = ({
  children,
  family
}: {
  children: React.ReactNode;
  family: Family | undefined;
}) => {
  return (
    <CurrentFamilyContext.Provider value={family ?? null}>
      {children}
    </CurrentFamilyContext.Provider>
  );
};

export const useCurrentFamily = () => {
  return useContext(CurrentFamilyContext);
};

export const useCurrentFamilyCurrency = () => {
  const family = useCurrentFamily();

  return family?.currency || 'USD';
};
