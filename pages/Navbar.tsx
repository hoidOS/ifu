import Link from 'next/link';
import { FaBars, FaWindowClose, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
import { useState } from 'react'

function Navbar() {

    const [nav, setNav] = useState(false)
    const handleNav = () => {
        setNav(!nav)
    }

    return (
        <>
            <nav className="flex justify-between bg-[#e6e8eb] text-[#0059a9] p-4 px-8 border-b-4 border-solid border-[#0059a9] w-full sticky top-0 z-10">
                <div className="self-center">
                    <Link href="/">
                        <h1 className="bold cursor-pointer text-4xl">STEINACKER</h1>
                    </Link>
                </div>
                <div className="lg:flex hidden">
                    <ul className="flex justify-between space-x-5 m-auto uppercase">
                        <li className="text-xl">
                            <Link href="/Stop">Anhalt</Link>
                        </li>
                        <li className="text-xl">
                            <Link href="/Const">Konstant</Link>
                        </li>
                        {/* <li className="text-xl">
                            <Link href="/Sonst">Sonstig</Link>
                        </li> */}
                        <li className="text-xl">
                            <Link href="/VMT">VMT</Link>
                        </li>
                    </ul>
                </div>
                <div className="flex lg:hidden">
                    <FaBars size={35} className="self-center cursor-pointer" onClick={handleNav} />
                </div>
            </nav>

            <div className={nav ? "fixed z-10 right-0 top-0 w-[100%] h-[100%] bg-slate-900/70" : ''} onClick={handleNav}>
                <div className={nav ? "fixed z-10 left-0 top-0 w-[80%] sm:w-[60%] md:w-[60%] h-[100%] bg-gradient-to-b from-[#0059a9] to-[#5cadf4] px-4 py-10 ease-in-out duration-500" :
                    "fixed z-10 left-[-100%] top-0 h-[100%] bg-gradient-to-b from-[#0059a9] to-[#5cadf4] p-10 ease-in-out duration-500"}>
                    <div className="flex-cols p-2">
                        <div className="flex justify-between">
                            <h1 className="text-white cursor-pointer text-3xl pb-4"><Link href="/">STEINACKER</Link></h1>
                            <FaWindowClose className="text-white h-5 w-5 cursor-pointer hover:scale-110" onClick={handleNav} />
                        </div>
                        <hr className="mt-1" />
                        <div className="p-2">
                            <div className="flex space-x-2 py-4 justify-left">
                                <p className="text-white text-2xl cursor-pointer flex space-x-2 m-0"><FaCarCrash size={30} className="flex text-white self-center"/><Link href="/Stop">Anhaltevorgang</Link></p>
                            </div>
                            <div className="flex space-x-2 py-4 justify-left">
                                <p className="text-white text-2xl cursor-pointer flex space-x-2 m-0"><FaCar size={30} className="flex text-white self-center"/><Link href="/Const">Konstantfahrt</Link></p>
                            </div>
                            <div className="flex space-x-2 py-4 justify-left">
                                <p className="text-white text-2xl cursor-pointer flex space-x-2 m-0"><FaCamera size={30} className="flex text-white self-center"/><Link href="/VMT">VMT</Link></p>
                            </div>
                            <div className="flex space-x-2 py-4 justify-left">
                                <p className="text-white text-2xl cursor-pointer flex space-x-2 m-0"><FaMoneyBill size={30} className="flex text-white self-center"/><Link href="/Minderwert">Minderwert</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>



    )
}

export default Navbar