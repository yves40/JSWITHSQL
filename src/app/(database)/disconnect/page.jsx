"use client"
import { mysqlDisconnect } from '@/app/lib/server/db';
import { useState, useEffect } from 'react';
import { DbContext } from '@/app/context/DbContext';

export default function disconnect() {
  const [ state, setState] = useState(
    [
      'Disconnection requested',
      false
    ]
  );
  
  useEffect( () => {
    if(!state.connected) {
      mysqlDisconnect()
        .then( result => {
          setState( ['Disconnected', true ])
          console.log(result)
        })
        .catch( error => {
          setState( ['Disconnection error', false ])
          console.log(error)
        })
    }
  }, [])
  
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Disconnect from DB</span>
      <h2 className=' text-white'>{state}</h2>
    </div>
  )
}
