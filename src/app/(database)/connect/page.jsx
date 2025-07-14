// "use client"
// import { useState } from 'react';
import { mysqlConnect } from '@/app/lib/server/db';

export default async function ConnectDB() {

  // const [state, setState ] = useState(0);

  let message = 'No status right now';
  const connectionstatus = await mysqlConnect(); 
  Promise.all([connectionstatus])
    .then( (result) => {
      message = "Connection OK"
    })
    .catch( (result) => {
      message = "Connection was not possible, the DB sql server is down or rejected your credentials"
    })
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Connect DB</span>
      <h2 className=' text-white'>{message}</h2>
    </div>
  )
}
