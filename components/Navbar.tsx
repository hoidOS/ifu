import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/logo/logo.png';
import { useRouter } from 'next/router';
import { FaBars, FaWindowClose, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

const NAV_ACCENTS: Record<string, string> = {
    '/stop': 'linear-gradient(135deg, rgba(248,113,113,0.18), rgba(248,113,113,0.32))',
    '/const': 'linear-gradient(135deg, rgba(59,130,246,0.16), rgba(59,130,246,0.3))',
    '/sonst': 'linear-gradient(135deg, rgba(168,85,247,0.18), rgba(168,85,247,0.32))',
    '/vmt': 'linear-gradient(135deg, rgba(34,197,94,0.18), rgba(34,197,94,0.3))',
    '/minderwert': 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.3))'
}

const DEFAULT_ACCENT = 'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.24))'

function Navbar() {
    const router = useRouter();
    const [nav, setNav] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const navListRef = useRef<HTMLUListElement | null>(null)
    const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 })
    const [indicatorColor, setIndicatorColor] = useState<string>(DEFAULT_ACCENT)
    const [isScrolled, setIsScrolled] = useState(false)

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
        const isRightSwipe = distance < -50

        if (isRightSwipe && nav) {
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 12)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const updateIndicator = () => {
            const listElement = navListRef.current
            if (!listElement) return
            const activeItem = listElement.querySelector<HTMLLIElement>('li[data-active="true"]')

            if (activeItem) {
                setIndicatorStyle({
                    width: activeItem.offsetWidth,
                    left: activeItem.offsetLeft
                })
            } else {
                setIndicatorStyle({ width: 0, left: 0 })
            }

            const accentKey = router.pathname.startsWith('/const') ? '/const' : router.pathname
            setIndicatorColor(NAV_ACCENTS[accentKey] ?? DEFAULT_ACCENT)
        }

        const frame = requestAnimationFrame(updateIndicator)
        window.addEventListener('resize', updateIndicator)

        return () => {
            cancelAnimationFrame(frame)
            window.removeEventListener('resize', updateIndicator)
        }
    }, [router.pathname])

    return (
        <>
            <nav className={`sticky top-0 z-20 w-full border-b backdrop-blur transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-lg border-slate-200/80' : 'bg-white/60 shadow-sm border-slate-200/40'}`}>
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6">
                    <div className="self-center">
                        <Link href="/">
                            <div className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-50 px-5 py-3 shadow-lg shadow-blue-200/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-300/40 hover:scale-[1.02] border border-blue-100">
                                    <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary-300/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    {/* Subtle shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative flex items-center justify-center">
                                        <div className="relative w-44 md:w-52 transition-transform duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_16px_40px_rgba(37,99,235,0.35)]">
                                            <Image
                                                src={logo}
                                                alt="Steinacker"
                                                width={238}
                                                height={54}
                                                className="h-auto w-full object-contain"
                                                priority
                                            />
                                            <span className="pointer-events-none absolute inset-0 rounded-lg border border-white/40"></span>
                                            <span className="pointer-events-none absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-r from-transparent via-blue-200/50 to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></span>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom accent line */}
                                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <div className="relative rounded-full bg-white/60 backdrop-blur px-1 py-1 ring-1 ring-slate-200/70 shadow-[0_12px_30px_rgba(148,163,184,0.14)]">
                            <ul
                                ref={navListRef}
                                className="relative flex items-center gap-0 text-[0.95rem] font-medium text-slate-600"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 rounded-full shadow-[0_10px_25px_rgba(148,163,184,0.15)] transition-all duration-300 ease-out"
                                    style={{
                                        width: indicatorStyle.width ? `${indicatorStyle.width}px` : 0,
                                        left: indicatorStyle.width ? `${indicatorStyle.left}px` : undefined,
                                        opacity: indicatorStyle.width ? 1 : 0,
                                        background: indicatorColor
                                    }}
                                ></span>
                                <li className="relative flex-1" data-route="/stop" data-active={router.pathname === '/stop'}>
                                    <Link
                                        href="/stop"
                                        className={`relative z-10 group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 ${router.pathname === '/stop' ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}
                                        aria-current={router.pathname === '/stop' ? 'page' : undefined}
                                    >
                                        <FaCarCrash
                                            className={`transition-transform duration-300 ${router.pathname === '/stop' ? 'text-red-500 scale-110' : 'text-red-400 group-hover:text-red-500 group-hover:scale-[1.08] group-hover:drop-shadow-[0_8px_20px_rgba(248,113,113,0.35)]'}`}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        <span className="tracking-wide">Anhalt</span>
                                    </Link>
                                </li>
                                <li className="relative flex-1" data-route="/const" data-active={router.pathname.startsWith('/const')}>
                                    <Link
                                        href="/const"
                                        className={`relative z-10 group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 ${router.pathname.startsWith('/const') ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}`}
                                        aria-current={router.pathname.startsWith('/const') ? 'page' : undefined}
                                    >
                                        <FaCar
                                            className={`transition-transform duration-300 ${router.pathname.startsWith('/const') ? 'text-blue-500 scale-110' : 'text-blue-400 group-hover:text-blue-500 group-hover:scale-[1.08] group-hover:drop-shadow-[0_8px_20px_rgba(96,165,250,0.35)]'}`}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        <span className="tracking-wide">Konstant</span>
                                    </Link>
                                </li>
                                <li className="relative flex-1" data-route="/sonst" data-active={router.pathname === '/sonst'}>
                                    <Link
                                        href="/sonst"
                                        className={`relative z-10 group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 ${router.pathname === '/sonst' ? 'text-purple-600 font-semibold' : 'hover:text-purple-600'}`}
                                        aria-current={router.pathname === '/sonst' ? 'page' : undefined}
                                    >
                                        <svg
                                            className={`h-[18px] w-[18px] transition-transform duration-300 ${router.pathname === '/sonst' ? 'text-purple-500 scale-110' : 'text-purple-400 group-hover:text-purple-500 group-hover:scale-[1.08] group-hover:drop-shadow-[0_8px_20px_rgba(192,132,252,0.35)]'}`}
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        <span className="tracking-wide">Sonstiges</span>
                                    </Link>
                                </li>
                                <li className="relative flex-1" data-route="/vmt" data-active={router.pathname === '/vmt'}>
                                    <Link
                                        href="/vmt"
                                        className={`relative z-10 group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 ${router.pathname === '/vmt' ? 'text-green-600 font-semibold' : 'hover:text-green-600'}`}
                                        aria-current={router.pathname === '/vmt' ? 'page' : undefined}
                                    >
                                        <FaCamera
                                            className={`transition-transform duration-300 ${router.pathname === '/vmt' ? 'text-green-500 scale-110' : 'text-green-400 group-hover:text-green-500 group-hover:scale-[1.08] group-hover:drop-shadow-[0_8px_20px_rgba(74,222,128,0.35)]'}`}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        <span className="tracking-wide">VMT</span>
                                    </Link>
                                </li>
                                <li className="relative flex-1" data-route="/minderwert" data-active={router.pathname === '/minderwert'}>
                                    <Link
                                        href="/minderwert"
                                        className={`relative z-10 group flex w-full items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] text-slate-600 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-200 ${router.pathname === '/minderwert' ? 'text-amber-600 font-semibold' : 'hover:text-amber-600'}`}
                                        aria-current={router.pathname === '/minderwert' ? 'page' : undefined}
                                    >
                                        <FaMoneyBill
                                            className={`transition-transform duration-300 ${router.pathname === '/minderwert' ? 'text-amber-500 scale-110' : 'text-amber-400 group-hover:text-amber-500 group-hover:scale-[1.08] group-hover:drop-shadow-[0_8px_20px_rgba(251,191,36,0.38)]'}`}
                                            size={18}
                                            aria-hidden="true"
                                        />
                                        <span className="tracking-wide">Minderwert</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
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
                        "fixed z-30 right-0 top-0 w-[85%] sm:w-[400px] h-full bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transform transition-transform duration-500 ease-out" :
                        "fixed z-30 right-0 top-0 w-[85%] sm:w-[400px] h-full bg-white/95 backdrop-blur-xl border-l border-white/20 shadow-2xl transform translate-x-full transition-transform duration-500 ease-out"
                    }
                    onClick={(event) => event.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-menu-title"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
                        <Link href="/" onClick={handleNav} className="group cursor-pointer" aria-label="Zur STEINACKER Startseite">
                            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4 py-3 shadow-lg shadow-blue-200/30 transition-all duration-300 group-active:scale-[0.98] border border-blue-100">
                                <div className="absolute inset-x-6 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary-300/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative flex items-center justify-center">
                                    <div className="relative w-36 transition-transform duration-300 group-hover:scale-[1.03] group-hover:drop-shadow-[0_16px_40px_rgba(37,99,235,0.35)]">
                                        <Image
                                            src={logo}
                                            alt="STEINACKER"
                                            width={238}
                                            height={54}
                                            className="h-auto w-full object-contain"
                                            priority
                                        />
                                        <span className="pointer-events-none absolute inset-0 rounded-lg border border-white/40"></span>
                                        <span className="pointer-events-none absolute inset-x-0 -bottom-2 h-2 bg-gradient-to-r from-transparent via-blue-200/50 to-transparent opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></span>
                                    </div>
                                    <span id="mobile-menu-title" className="sr-only">STEINACKER</span>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"></div>
                            </div>
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
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-100" : "opacity-0 transform translate-x-4"}>
                                <Link href="/stop" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:-translate-x-1 group active:scale-95 cursor-pointer">
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
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-200" : "opacity-0 transform translate-x-4"}>
                                <Link href="/const" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:-translate-x-1 group active:scale-95 cursor-pointer">
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
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-300" : "opacity-0 transform translate-x-4"}>
                                <Link href="/sonst" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:-translate-x-1 group active:scale-95 cursor-pointer">
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
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-400" : "opacity-0 transform translate-x-4"}>
                                <Link href="/vmt" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:-translate-x-1 group active:scale-95 cursor-pointer">
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
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-500" : "opacity-0 transform translate-x-4"}>
                                <Link href="/minderwert" onClick={handleNav}>
                                    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-100/50 transition-all duration-200 hover:transform hover:-translate-x-1 group active:scale-95 cursor-pointer">
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
                            © 2025 STEINACKER
                        </p>
                    </div>
                </div>
            </div>
        </>



    )
}

export default Navbar
