"use client"

import Link from "next/link";
import { DbContext } from "@/app/context/DbContext";
import { useContext } from "react";

const modulename = 'Navbar.jsx # ';

export default function Navbar() {

  const {dbctx}  = useContext(DbContext);

  return (
    // u-main-container is defined in globals.css 
    <nav className=" fixed z-10 w-full bg-slate-50 border-b border-b-zinc-300">
      <div className="u-main-container flex py-4">
          <Link href="/" className=" mr-6 text-zinc-900 mr-auto">Home</Link>
          {!dbctx.connected && (
            <>
              <Link href="/connect" className=" mr-6 text-zinc-900">Connect</Link>
            </>
          )}
          <Link href="https://www.w3schools.com/nodejs/nodejs_mysql.asp" className=" mr-6 text-zinc-900" 
                      target="_blank">MySQL and Node.js</Link>
          <Link href="https://nextjs.org/" className=" mr-6 text-zinc-900" target="_blank">Next.js</Link>
          <Link href="https://react.dev/" className=" mr-6 text-zinc-900" target="_blank">React</Link>
        </div>
    </nav>
  )
}
