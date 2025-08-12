
import Link from "next/link"

function Footer() {
  return (
    <footer className=" text-center bg-white p-4 border-t border-t-zinc-300">
      <Link href="#">
        MySQL tester &copy; : Aug 11 2025 : 1.05
      </Link>
    </footer>
  )
}

export default Footer