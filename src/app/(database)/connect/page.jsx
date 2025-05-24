import React from 'react'
import { mysqlConnect } from '@/app/lib/server/db';

export default async function ConnectDB() {

  const connectionstatus = await mysqlConnect(); 

  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Connect DB</span>
    </div>
  )
}
