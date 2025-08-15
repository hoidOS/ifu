import Link from 'next/link';
import { FaBars, FaWindowClose, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
import { useState, useEffect } from 'react'

function Navbar() {

    const [nav, setNav] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const handleNav = () => {
        setNav(!nav)
    }

    // Handle swipe to close
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe && nav) {
            setNav(false)
        }
    }

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (nav) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [nav])

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && nav) {
                setNav(false)
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [nav])

    return (
        <>
            <nav className="sticky top-0 z-20 w-full bg-white/70 backdrop-blur border-b border-slate-200 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                    <div className="self-center">
                        <Link href="/">
                            <h1 className="bold cursor-pointer text-2xl md:text-3xl text-primary-700">STEINACKER</h1>
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center gap-6">
                        <ul className="flex justify-between space-x-6 m-auto uppercase text-slate-700">
                            <li className="text-base hover:text-primary-600"><Link href="/Stop">Anhalt</Link></li>
                            <li className="text-base hover:text-primary-600"><Link href="/Const">Konstant</Link></li>
                            <li className="text-base hover:text-primary-600"><Link href="/VMT">VMT</Link></li>
                            <li className="text-base hover:text-primary-600"><Link href="/Minderwert">Minderwert</Link></li>
                        </ul>
                    </div>
                    <div className="flex lg:hidden items-center gap-3">
                        <FaBars size={28} className="self-center cursor-pointer text-slate-700" onClick={handleNav} />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            <div 
                className={nav ? "fixed z-30 inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" : 'opacity-0 pointer-events-none'} 
                onClick={handleNav}
                aria-hidden="true"
            >
                {/* Mobile Menu Panel */}
                <div 
                    className={nav ? 
                        "fixed z-30 left-0 top-0 w-[85%] sm:w-[400px] h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform transition-transform duration-500 ease-out" :
                        "fixed z-30 left-0 top-0 w-[85%] sm:w-[400px] h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl transform -translate-x-full transition-transform duration-500 ease-out"
                    }
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-menu-title"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
                        <Link href="/" onClick={handleNav}>
                            <h1 
                                id="mobile-menu-title"
                                className="text-2xl font-bold text-slate-900 hover:text-primary-600 transition-colors cursor-pointer"
                            >
                                STEINACKER
                            </h1>
                        </Link>
                        <button 
                            onClick={handleNav}
                            className="p-2 rounded-full bg-slate-100/50 hover:bg-slate-200/50 transition-colors duration-200"
                            aria-label="Close menu"
                        >
                            <FaWindowClose className="w-5 h-5 text-slate-600" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="px-6 py-8">
                        <ul className="space-y-2">
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-100" : "opacity-0 transform -translate-x-4"}>
                                <Link href="/Stop" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:translate-x-1 group active:scale-95 cursor-pointer">
                                        <div className="p-3 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200 transition-colors">
                                            <FaCarCrash size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600">Anhaltevorgang</h3>
                                            <p className="text-sm text-slate-500">Crash analysis tools</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-200" : "opacity-0 transform -translate-x-4"}>
                                <Link href="/Const" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:translate-x-1 group active:scale-95 cursor-pointer">
                                        <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                                            <FaCar size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600">Konstantfahrt</h3>
                                            <p className="text-sm text-slate-500">Constant speed analysis</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-300" : "opacity-0 transform -translate-x-4"}>
                                <Link href="/VMT" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:translate-x-1 group active:scale-95 cursor-pointer">
                                        <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                                            <FaCamera size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600">VMT</h3>
                                            <p className="text-sm text-slate-500">Video measurement tools</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-500" : "opacity-0 transform -translate-x-4"}>
                                <Link href="/Minderwert" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:translate-x-1 group active:scale-95 cursor-pointer">
                                        <div className="p-3 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors">
                                            <FaMoneyBill size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600">Minderwert</h3>
                                            <p className="text-sm text-slate-500">Value assessment</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50">
                        <p className="text-xs text-slate-400 text-center">
                            © 2024 STEINACKER
                        </p>
                    </div>
                </div>
            </div>
        </>



    )
}

export default Navbar
