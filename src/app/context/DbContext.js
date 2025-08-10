"use client"
import { createContext, useState } from "react";

export const DbContext =createContext();
export function DbProvider({children}) {
  
  const [dbctx, setDbctx] = useState( {
    loading: true,
    connected: false
  })

  return (
    <DbContext.Provider value={{dbctx, setDbctx}}>
      {children}
    </DbContext.Provider>
  )
}
export default DbContext;
