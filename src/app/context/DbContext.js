"use client"

import { createContext, useContext, useState, useEffect } from "react";

export const DbContext =createContext();

export function DbProvider({children}) {
  
  const [dbctx, setDbctx] = useState( {
    loading: true,
    connected: false
  })

  function toggleConnection() {
    if(connected) {
      console.log(`********* Currently connected`);
    }
    else {
      console.log(`********* Currently disconnected`);
    }
    setDbctx({
      loading: false,
      connected: !connected
    })
  }

  useEffect( () => {
    console.log(`********* DbContext useEffect() triggered`);
  }, [dbctx])

  return (
    <DbContext.Provider value={{dbctx, toggleConnection}}>
      {children}
    </DbContext.Provider>
  )
}

export function useDbContext() { return useContext(DbContext)}
