import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for your context methods
interface WisbContextType {
  myMethod: () => void;
}

// Create the context with a default value
const MyContext = createContext<WisbContextType | undefined>(undefined);

// Define a hook to use the context
export const useWisbContextContext = (): WisbContextType => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};

// Define the provider component type
interface WisbContextProviderProps {
  children: ReactNode;
//   open
}

// Create the provider component
export const WisbContextProvider: React.FC<WisbContextProviderProps> = ({ children }) => {
  const myMethod = () => {
    console.log('My method called');
  };

  return (
    <MyContext.Provider value={{ myMethod }}>
      {children}
    </MyContext.Provider>
  );
};