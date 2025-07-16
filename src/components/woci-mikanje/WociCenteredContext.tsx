import { createContext, useContext } from 'react';

export type WociCenteredContextType = {
  isCentered: boolean;
  setIsCentered: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WociCenteredContext = createContext<WociCenteredContextType | undefined>(undefined);
export const useWociCentered = () => useContext(WociCenteredContext);
