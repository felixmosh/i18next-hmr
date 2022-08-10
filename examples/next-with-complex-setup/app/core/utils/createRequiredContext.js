import { createContext, useContext } from 'react';

export function createRequiredContext(contextName) {
  const requiredContext = createContext(undefined);

  function useRequiredContext() {
    const contextValue = useContext(requiredContext);

    if (contextValue === undefined) {
      throw new Error(`${contextName} must be used inside a Provider with a value.`);
    }
    return contextValue;
  }

  return [useRequiredContext, requiredContext.Provider];
}
