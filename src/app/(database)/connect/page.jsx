"use client"
import { useState } from 'react';
import { mysqlConnect } from '@/app/lib/server/db';

export default function ConnectDB() {

  const [state, setState ] = useState(0);

  const connectionstatus = mysqlConnect(); 

  return (
    <div className="u-main-container u-padding-content-container">
      <span className=' text-cyan-100'>Connect DB</span>
    </div>
  )
}
