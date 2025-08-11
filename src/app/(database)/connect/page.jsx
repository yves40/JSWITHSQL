"use client"
import { useContext, useEffect, useState } from 'react';
import { DbContext } from '@/app/context/DbContext';
import { mysqlConnect} from '@/app/lib/server/db';

export default function connect() {

  const [ state, setState] = useState(false);
  const [appMessage, setappMessage] = useState('Connection requested');
  const [dbMessage, setdbMessage] = useState('No problemo');
  const [first, setFirst] = useState(true);

  useEffect( () => {
      if(!state) {
        mysqlConnect()
        .then( result => {
          console.log(result);
          setState(true);
          setappMessage(result);
          setdbMessage('');
        })
        .catch( error => {
          console.log(error.message);
          const appmessage = error.message.split('@***@')[0];
          const dbmessage = error.message.split('@***@')[1];
          setState(false);
          setappMessage(appmessage);
          setdbMessage(dbmessage);
        })
      }
      else {
        setappMessage('Already connected');
      }
      setFirst(false);
  }, [])

  // const dbctx = useContext(DbContext);
  // console.log(dbctx);
  
  return (
    <div className="u-main-container u-padding-content-container text-cyan-100">
      <span>Connect to the DB</span>
      <p>Test code to check some mySQL libs</p>
      <h2 className={(state || first) ? 'text-white mt-5 pl-2' : 'text-black mt-5 bg-amber-600 pl-2'}>{appMessage}</h2>
      { (!state && !first) && <h2 className='text-black mt-2 pl-2 bg-amber-600'>Cause        : {dbMessage}</h2>}
    </div>
  )
}
