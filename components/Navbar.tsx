import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/logo/logo.png';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
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
    const mobileMenuRef = useRef<HTMLDivElement | null>(null)
    const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null)
    const [indicatorStyle, setIndicatorStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 })
    const [indicatorColor, setIndicatorColor] = useState<string>(DEFAULT_ACCENT)
    const [isScrolled, setIsScrolled] = useState(false)

    const handleNav = () => {
        setNav((current) => !current)
    }

    const closeNav = () => {
        setNav(false)
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
            closeNav()
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

    useEffect(() => {
        if (!nav) return

        const frame = requestAnimationFrame(() => {
            mobileCloseButtonRef.current?.focus()
        })

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeNav()
                return
            }

            if (e.key !== 'Tab') return

            const menuElement = mobileMenuRef.current
            if (!menuElement) return

            const focusableElements = Array.from(
                menuElement.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter((element) => !element.hasAttribute('disabled') && element.offsetParent !== null)

            if (!focusableElements.length) return

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (!firstElement || !lastElement) return

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault()
                lastElement.focus()
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault()
                firstElement.focus()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            cancelAnimationFrame(frame)
            document.removeEventListener('keydown', handleKeyDown)
        }
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

    const isStopActive = router.pathname === '/stop'
    const isConstActive = router.pathname.startsWith('/const')
    const isSonstActive = router.pathname === '/sonst'
    const isVmtActive = router.pathname === '/vmt'
    const isMinderwertActive = router.pathname === '/minderwert'

    const mobileLinkClasses = (isActive: boolean, activeClasses: string) =>
        `group flex items-center gap-4 rounded-lg p-4 transition-colors duration-200 active:scale-[0.98] ${isActive ? activeClasses : 'hover:bg-slate-100/60'}`

    return (
        <>
            <nav
                className={`sticky top-0 z-20 w-full border-b backdrop-blur transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-lg border-slate-200/80' : 'bg-white/60 shadow-sm border-slate-200/40'}`}
                aria-label="Hauptnavigation"
            >
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6">
                    <div className="self-center">
                        <Link
                            href="/"
                            className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                            aria-label="Zur STEINACKER Startseite"
                        >
                            <span className="inline-flex items-center rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur transition-colors duration-200 hover:bg-white">
                                <Image
                                    src={logo}
                                    alt="Steinacker"
                                    width={238}
                                    height={54}
                                    className="h-auto w-36 object-contain md:w-44"
                                    priority
                                />
                            </span>
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
                        <button
                            type="button"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                            onClick={handleNav}
                            aria-label={nav ? 'Menü schließen' : 'Menü öffnen'}
                            aria-expanded={nav}
                            aria-controls="mobile-navigation-menu"
                        >
                            <FaBars size={28} aria-hidden="true" focusable="false" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Backdrop */}
            <div
                className={nav ? "fixed z-30 inset-0 bg-black/60 backdrop-blur-sm opacity-100 transition-opacity duration-300" : "fixed z-30 inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300"}
                onClick={closeNav}
                aria-hidden={!nav}
                inert={!nav}
            >
                {/* Mobile Menu Panel */}
                <div
                    id="mobile-navigation-menu"
                    ref={mobileMenuRef}
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
                        <Link
                            href="/"
                            onClick={closeNav}
                            className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                            aria-label="Zur STEINACKER Startseite"
                        >
                            <span className="inline-flex items-center rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur transition-colors duration-200 active:bg-white">
                                <Image
                                    src={logo}
                                    alt="STEINACKER"
                                    width={238}
                                    height={54}
                                    className="h-auto w-34 object-contain"
                                    priority
                                />
                                <span id="mobile-menu-title" className="sr-only">STEINACKER</span>
                            </span>
                        </Link>
                        <button
                            type="button"
                            ref={mobileCloseButtonRef}
                            onClick={closeNav}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100/70 text-slate-600 transition-colors duration-200 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                            aria-label="Menü schließen"
                        >
                            <FaTimes className="h-5 w-5" aria-hidden="true" focusable="false" />
                        </button>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="px-6 py-8" aria-label="Mobile Hauptnavigation">
                        <ul className="space-y-2">
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-100" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/stop"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isStopActive, 'bg-red-50 text-red-700 ring-1 ring-red-100')}
                                    aria-current={isStopActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isStopActive ? 'bg-red-100 text-red-700' : 'bg-red-100 text-red-600 group-hover:bg-red-200'}`}>
                                        <FaCarCrash size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isStopActive ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'}`}>Anhaltevorgang</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-200" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/const"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isConstActive, 'bg-blue-50 text-blue-700 ring-1 ring-blue-100')}
                                    aria-current={isConstActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isConstActive ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
                                        <FaCar size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isConstActive ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>Konstantfahrt</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-300" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/sonst"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isSonstActive, 'bg-purple-50 text-purple-700 ring-1 ring-purple-100')}
                                    aria-current={isSonstActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isSonstActive ? 'bg-purple-100 text-purple-700' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'}`}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                    </span>
                                    <span className={`font-semibold ${isSonstActive ? 'text-purple-700' : 'text-slate-900 group-hover:text-purple-600'}`}>Sonstiges</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-400" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/vmt"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isVmtActive, 'bg-green-50 text-green-700 ring-1 ring-green-100')}
                                    aria-current={isVmtActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isVmtActive ? 'bg-green-100 text-green-700' : 'bg-green-100 text-green-600 group-hover:bg-green-200'}`}>
                                        <FaCamera size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isVmtActive ? 'text-green-700' : 'text-slate-900 group-hover:text-green-600'}`}>VMT</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-500" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/minderwert"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isMinderwertActive, 'bg-amber-50 text-amber-700 ring-1 ring-amber-100')}
                                    aria-current={isMinderwertActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isMinderwertActive ? 'bg-amber-100 text-amber-700' : 'bg-amber-100 text-amber-600 group-hover:bg-amber-200'}`}>
                                        <FaMoneyBill size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isMinderwertActive ? 'text-amber-700' : 'text-slate-900 group-hover:text-amber-600'}`}>Minderwert</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-200/50">
                        <p className="text-xs text-slate-400 text-center">
                            &copy; {new Date().getFullYear()} STEINACKER
                        </p>
                    </div>
                </div>
            </div>
        </>



    )
}

export default Navbar
