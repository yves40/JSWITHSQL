"use client"

import Link from "next/link"

const modulename = 'Navbar.jsx # ';

export default function Navbar() {

  return (
    // u-main-container is defined in globals.css 
    <nav className=" fixed z-10 w-full bg-slate-50 border-b border-b-zinc-300">
      <div className="u-main-container flex py-4">
          <Link href="https://www.w3schools.com/nodejs/nodejs_mysql.asp" className=" mr-6 text-zinc-900" target="_blank">MySQL and Node.js</Link>
          <Link href="https://nextjs.org/" className=" mr-6 text-zinc-900" target="_blank">Next.js</Link>
          <Link href="https://react.dev/" className=" mr-6 text-zinc-900" target="_blank">React</Link>
        </div>
    </nav>
  )
}
