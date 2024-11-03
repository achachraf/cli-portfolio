import React, { createContext, useContext, useRef, RefObject } from 'react';

const InputRefContext = createContext<RefObject<HTMLInputElement> | null>(null);

export const InputRefProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <InputRefContext.Provider value={inputRef}>
      {children}
    </InputRefContext.Provider>
  );
};

export const useInputRef = () => {
  const context = useContext(InputRefContext);
  if (!context) {
    throw new Error('useInputRef must be used within an InputRefProvider');
  }
  return context;
};