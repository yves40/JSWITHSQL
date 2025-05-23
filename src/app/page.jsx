import Link from "next/link"

export const revalidate = 60;   // Check nextJS cache every minute

export default async function Home() {

  return (
    // u-main-container is defined in globals.css 
    <div className="u-main-container u-padding-content-container">
      <h1 className="t-main-title">Test platform for MySQL</h1>
      <p className="t-main-subtitle">The idea is to code and test a few basic SQL access
      </p>
    </div>
  )
}
