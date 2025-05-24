import React from 'react'
import { mysqlDisconnect } from '@/app/lib/server/db';

export default async function Disconnect() {
  const connectionstatus = await mysqlDisconnect();
  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Disconnect from DB</span>
    </div>
  )
}
