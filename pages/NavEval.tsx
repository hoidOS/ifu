import Link from "next/link"

function NavEval() {
  return (
            <div className="hidden lg:flex fixed flex-cols top-[40%] left-0">
                <ul>
                    <li className="flex justify-center p-4 text-2xl font-bold bg-[#0059a9] rounded-tr-xl">
                        <Link href="/Minderwert/MFM">MFM</Link>
                    </li>
                    <li className="flex justify-center p-4 text-2xl font-bold bg-slate-500 rounded-br-xl">
                        <Link href="/BVSK">BVSK</Link>
                    </li>
                </ul>
            </div>
  )
}

export default NavEval