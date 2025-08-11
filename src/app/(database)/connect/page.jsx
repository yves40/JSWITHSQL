"use client"
import { useContext, useEffect, useState } from 'react';
import { DbContext } from '@/app/context/DbContext';
import { mysqlConnect } from '@/app/lib/server/db';



export default function connect() {
  const [ state, setState] = useState( 
    [{
      message: 'Connection requested',
      connected: false,
    }]
  );

  function getState() {
    return state[0].connected;
  }
  function getMessage() {
    return state[0].message;
  }

  useEffect( () => {
    if(!getState()) {
      mysqlConnect()
        .then( result => {
          setState( [{
              message: `${result.message}`,
              connected: true,
            }]);
          console.log(result)
        })
        .catch( error => {
          setState( [{
              message: `${error.message}`,
              connected: false,
            }]);
          console.log(`***************** ${error}`);
        })
    }
  }, [])

  // const dbctx = useContext(DbContext);
  // console.log(dbctx);
  
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Connect DB</span>
      <h2 className=' underline text-white'>{getMessage()}</h2>
    </div>
  )
}
