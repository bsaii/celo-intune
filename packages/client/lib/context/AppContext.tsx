import { ActionType, appReducer } from './AppReducer';
import { AppState, initialState } from './AppState';
import React, { useContext, useReducer } from 'react';
import { createContext } from 'react';

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context with default value
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContext must be used within an AppContextProvider');
  }
  return context;
};
