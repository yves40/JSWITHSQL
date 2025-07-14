import React from 'react'
import { mysqlDisconnect } from '@/app/lib/server/db';

export default async function Disconnect() {
  let message = 'No status right now';
  const connectionstatus = await mysqlDisconnect();
  Promise.all([connectionstatus])
  .then( (result) => {
      message = "DisConnection OK"
    })
    .catch( result => {
      message = "Disconnection failed "
    }
  )
  
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Disconnect from DB</span>
    </div>
  )
}
