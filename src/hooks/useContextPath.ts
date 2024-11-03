import { useState } from 'react';

export const useContextPath = () => {
  const [context, setContext] = useState<string>('~');

  return {
    context,
    setContext,
  };
};