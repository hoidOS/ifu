import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaBars, FaWindowClose, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
import { useState, useEffect } from 'react'

function Navbar() {
    const router = useRouter();
    const [nav, setNav] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)

    const handleNav = () => {
        setNav(!nav)
    }

    // Handle swipe to close
    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        if (touch) {
            setTouchStart(touch.clientX);
        }
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        const touch = e.targetTouches[0];
        if (touch) {
            setTouchEnd(touch.clientX);
        }
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
                            <div className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-2.5 shadow-lg shadow-blue-200/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:scale-[1.02] border border-blue-100">
                                    {/* Subtle shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative">
                                        <h1 className="bold cursor-pointer text-2xl md:text-3xl text-primary-700 relative" style={{
                                            textShadow: '2px 2px 4px rgba(0, 89, 169, 0.3), 1px 1px 2px rgba(0, 89, 169, 0.2)',
                                            filter: 'drop-shadow(0 1px 2px rgba(0, 89, 169, 0.1))'
                                        }}>
                                            STEINACKER
                                        </h1>
                                    </div>
                                    
                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        <ul className="flex items-center gap-2 m-auto text-slate-700">
                            <li>
                                <Link href="/Stop">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer border ${
                                        router.pathname === '/Stop' 
                                            ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 shadow-lg shadow-red-200/40 border-red-200' 
                                            : 'hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 hover:shadow-lg hover:shadow-red-200/40 border-transparent hover:border-red-200'
                                    }`}>
                                        <FaCarCrash className={`transition-transform duration-300 ${
                                            router.pathname === '/Stop' ? 'text-red-600 scale-110' : 'text-red-500 group-hover:scale-110'
                                        }`} size={18} />
                                        <span className="relative" style={{
                                            textShadow: router.pathname === '/Stop' ? '1px 1px 2px rgba(185, 28, 28, 0.2)' : '',
                                            filter: router.pathname === '/Stop' ? 'drop-shadow(0 1px 1px rgba(185, 28, 28, 0.1))' : ''
                                        }}>
                                            Anhalt
                                            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-red-400 to-red-600 transform transition-transform duration-300 origin-left ${
                                                router.pathname === '/Stop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/Const">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer border ${
                                        router.pathname === '/Const' 
                                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-lg shadow-blue-200/40 border-blue-200' 
                                            : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 hover:shadow-lg hover:shadow-blue-200/40 border-transparent hover:border-blue-200'
                                    }`}>
                                        <FaCar className={`transition-transform duration-300 ${
                                            router.pathname === '/Const' ? 'text-blue-600 scale-110' : 'text-blue-500 group-hover:scale-110'
                                        }`} size={18} />
                                        <span className="relative" style={{
                                            textShadow: router.pathname === '/Const' ? '1px 1px 2px rgba(29, 78, 216, 0.2)' : '',
                                            filter: router.pathname === '/Const' ? 'drop-shadow(0 1px 1px rgba(29, 78, 216, 0.1))' : ''
                                        }}>
                                            Konstant
                                            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform transition-transform duration-300 origin-left ${
                                                router.pathname === '/Const' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/Sonst">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer border ${
                                        router.pathname === '/Sonst' 
                                            ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-lg shadow-purple-200/40 border-purple-200' 
                                            : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 hover:shadow-lg hover:shadow-purple-200/40 border-transparent hover:border-purple-200'
                                    }`}>
                                        <svg className={`transition-transform duration-300 ${
                                            router.pathname === '/Sonst' ? 'text-purple-600 scale-110' : 'text-purple-500 group-hover:scale-110'
                                        }`} width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        <span className="relative" style={{
                                            textShadow: router.pathname === '/Sonst' ? '1px 1px 2px rgba(126, 34, 206, 0.2)' : '',
                                            filter: router.pathname === '/Sonst' ? 'drop-shadow(0 1px 1px rgba(126, 34, 206, 0.1))' : ''
                                        }}>
                                            Sonstiges
                                            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 transform transition-transform duration-300 origin-left ${
                                                router.pathname === '/Sonst' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/VMT">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer border ${
                                        router.pathname === '/VMT' 
                                            ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 shadow-lg shadow-green-200/40 border-green-200' 
                                            : 'hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-700 hover:shadow-lg hover:shadow-green-200/40 border-transparent hover:border-green-200'
                                    }`}>
                                        <FaCamera className={`transition-transform duration-300 ${
                                            router.pathname === '/VMT' ? 'text-green-600 scale-110' : 'text-green-500 group-hover:scale-110'
                                        }`} size={18} />
                                        <span className="relative" style={{
                                            textShadow: router.pathname === '/VMT' ? '1px 1px 2px rgba(21, 128, 61, 0.2)' : '',
                                            filter: router.pathname === '/VMT' ? 'drop-shadow(0 1px 1px rgba(21, 128, 61, 0.1))' : ''
                                        }}>
                                            VMT
                                            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-green-400 to-green-600 transform transition-transform duration-300 origin-left ${
                                                router.pathname === '/VMT' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/Minderwert">
                                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all duration-300 group cursor-pointer border ${
                                        router.pathname === '/Minderwert' 
                                            ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 shadow-lg shadow-amber-200/40 border-amber-200' 
                                            : 'hover:bg-gradient-to-r hover:from-amber-50 hover:to-amber-100 hover:text-amber-700 hover:shadow-lg hover:shadow-amber-200/40 border-transparent hover:border-amber-200'
                                    }`}>
                                        <FaMoneyBill className={`transition-transform duration-300 ${
                                            router.pathname === '/Minderwert' ? 'text-amber-600 scale-110' : 'text-amber-500 group-hover:scale-110'
                                        }`} size={18} />
                                        <span className="relative" style={{
                                            textShadow: router.pathname === '/Minderwert' ? '1px 1px 2px rgba(180, 83, 9, 0.2)' : '',
                                            filter: router.pathname === '/Minderwert' ? 'drop-shadow(0 1px 1px rgba(180, 83, 9, 0.1))' : ''
                                        }}>
                                            Minderwert
                                            <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 transform transition-transform duration-300 origin-left ${
                                                router.pathname === '/Minderwert' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                                            }`}></span>
                                        </span>
                                    </div>
                                </Link>
                            </li>
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
                                <Link href="/Sonst" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:translate-x-1 group active:scale-95 cursor-pointer">
                                        <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600">Sonstiges</h3>
                                            <p className="text-sm text-slate-500">Slope calculations</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-400" : "opacity-0 transform -translate-x-4"}>
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
