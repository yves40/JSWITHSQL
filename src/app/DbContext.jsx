"use client"

import { createContext, useContext, useState, useEffect } from "react";

const DbContext =createContext();

export function DbProvider({children}) {

  const [isConnected, setIsConnected] = useState( {
    loading: true,
    dbConnected: false
  })

  // useEffect( () => {
  //   async function fetchDBSession() {
  //     const session = await mysqlConnect();
  //     setIsAuthenticated({
  //       loading: false,
  //       dbConnected: true
  //     })
  //   }
  //   fetchDBSession();
  // }, [])

  return (
    <DbContext.Provider value={{isConnected, setIsConnected}}>
      {children}
    </DbContext.Provider>
  )
}

export function useDbContext() { return useContext(DbContext)}
