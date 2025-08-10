"use client"
import { useContext, useEffect, useState } from 'react';
import { DbContext } from '@/app/context/DbContext';
import { mysqlConnect } from '@/app/lib/server/db';

export default function connect() {
  
  const [ state, setState] = useState(
    [
      'Connection requested',
      false
    ]
  );
  
  useEffect( () => {
    if(!state.connected) {
      mysqlConnect()
        .then( result => {
          setState( ['Connected', true ])
          console.log(result)
        })
        .catch( error => {
          setState( ['Connection error', false ])
          console.log(error)
        })
    }
  }, [])

  // const dbctx = useContext(DbContext);
  // console.log(dbctx);
  
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Connect DB</span>
      <h2 className=' text-white'>{state}</h2>
    </div>
  )
}
