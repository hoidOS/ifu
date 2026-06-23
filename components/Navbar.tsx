import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/logo/logo.png';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaCarCrash, FaCar, FaCamera, FaMoneyBill } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'

function Navbar() {
    const router = useRouter();
    const [nav, setNav] = useState(false)
    const [touchStart, setTouchStart] = useState(0)
    const [touchEnd, setTouchEnd] = useState(0)
    const mobileMenuRef = useRef<HTMLDivElement | null>(null)
    const mobileCloseButtonRef = useRef<HTMLButtonElement | null>(null)
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

    const isBremswegActive = router.pathname === '/bremsweg'
    const isKonstantfahrtActive = router.pathname === '/konstantfahrt'
    const isSonstActive = router.pathname === '/sonstige'
    const isVmtActive = router.pathname === '/vmt'
    const isMinderwertActive = router.pathname === '/minderwert'

    const mobileLinkClasses = (isActive: boolean, activeClasses: string) =>
        `group flex items-center gap-4 rounded-lg p-4 transition-colors duration-200 active:scale-[0.98] ${isActive ? activeClasses : 'hover:bg-slate-100/60'}`

    const desktopLinkClasses = (isActive: boolean, activeClasses: string, hoverClasses: string) =>
        `group relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[0.95rem] font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:opacity-0 after:transition-opacity after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 ${isActive ? activeClasses : `text-slate-600 ${hoverClasses}`}`

    return (
        <>
            <nav
                className={`sticky top-0 z-20 w-full border-b backdrop-blur transition-all duration-300 ${isScrolled ? 'bg-white/80 shadow-md border-slate-200/80' : 'bg-white/60 shadow-sm border-slate-200/40'}`}
                aria-label="Hauptnavigation"
            >
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-6">
                    <div className="self-center">
                        <Link
                            href="/"
                            className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                            aria-label="Zur STEINACKER Startseite"
                        >
                            <span className="inline-flex items-center rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 backdrop-blur transition-colors duration-200 hover:border-slate-300 hover:bg-white/80">
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
                        <ul className="flex items-center gap-1 text-slate-600">
                            <li>
                                <Link
                                    href="/bremsweg"
                                    className={desktopLinkClasses(isBremswegActive, 'font-semibold text-red-700 after:bg-red-500 after:opacity-100', 'hover:bg-white/70 hover:text-red-600')}
                                    aria-current={isBremswegActive ? 'page' : undefined}
                                >
                                    <FaCarCrash
                                        className={`${isBremswegActive ? 'text-red-600' : 'text-red-400 group-hover:text-red-500'}`}
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    <span>Anhalt</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/konstantfahrt"
                                    className={desktopLinkClasses(isKonstantfahrtActive, 'font-semibold text-blue-700 after:bg-blue-500 after:opacity-100', 'hover:bg-white/70 hover:text-blue-600')}
                                    aria-current={isKonstantfahrtActive ? 'page' : undefined}
                                >
                                    <FaCar
                                        className={`${isKonstantfahrtActive ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-500'}`}
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    <span>Konstant</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sonstige"
                                    className={desktopLinkClasses(isSonstActive, 'font-semibold text-purple-700 after:bg-purple-500 after:opacity-100', 'hover:bg-white/70 hover:text-purple-600')}
                                    aria-current={isSonstActive ? 'page' : undefined}
                                >
                                    <svg
                                        className={`h-[18px] w-[18px] ${isSonstActive ? 'text-purple-600' : 'text-purple-400 group-hover:text-purple-500'}`}
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                    </svg>
                                    <span>Sonstiges</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/vmt"
                                    className={desktopLinkClasses(isVmtActive, 'font-semibold text-teal-800 after:bg-teal-500 after:opacity-100', 'hover:bg-white/70 hover:text-teal-700')}
                                    aria-current={isVmtActive ? 'page' : undefined}
                                >
                                    <FaCamera
                                        className={`${isVmtActive ? 'text-teal-700' : 'text-teal-600 group-hover:text-teal-700'}`}
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    <span>VMT</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/minderwert"
                                    className={desktopLinkClasses(isMinderwertActive, 'font-semibold text-indigo-800 after:bg-indigo-500 after:opacity-100', 'hover:bg-white/70 hover:text-indigo-700')}
                                    aria-current={isMinderwertActive ? 'page' : undefined}
                                >
                                    <FaMoneyBill
                                        className={`${isMinderwertActive ? 'text-indigo-700' : 'text-indigo-600 group-hover:text-indigo-700'}`}
                                        size={18}
                                        aria-hidden="true"
                                    />
                                    <span>Minderwert</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="flex lg:hidden items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-transparent text-slate-700 transition-colors hover:border-slate-200 hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
                            onClick={handleNav}
                            aria-label={nav ? 'Menü schließen' : 'Menü öffnen'}
                            aria-expanded={nav}
                            aria-controls="mobile-navigation-menu"
                        >
                            <FaBars size={24} aria-hidden="true" focusable="false" />
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
                            <span className="inline-flex items-center rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 backdrop-blur transition-colors duration-200 active:bg-white/80">
                                <Image
                                    src={logo}
                                    alt="STEINACKER"
                                    width={238}
                                    height={54}
                                    className="h-auto w-36 object-contain"
                                    priority
                                />
                                <span id="mobile-menu-title" className="sr-only">STEINACKER</span>
                            </span>
                        </Link>
                        <button
                            type="button"
                            ref={mobileCloseButtonRef}
                            onClick={closeNav}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-transparent bg-slate-100/60 text-slate-600 transition-colors duration-200 hover:border-slate-200 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
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
                                    href="/bremsweg"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isBremswegActive, 'bg-red-50 text-red-700')}
                                    aria-current={isBremswegActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isBremswegActive ? 'bg-red-100 text-red-700' : 'bg-red-100 text-red-600 group-hover:bg-red-200'}`}>
                                        <FaCarCrash size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isBremswegActive ? 'text-red-700' : 'text-slate-900 group-hover:text-red-600'}`}>Anhaltevorgang</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-200" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/konstantfahrt"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isKonstantfahrtActive, 'bg-blue-50 text-blue-700')}
                                    aria-current={isKonstantfahrtActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isKonstantfahrtActive ? 'bg-blue-100 text-blue-700' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'}`}>
                                        <FaCar size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isKonstantfahrtActive ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>Konstantfahrt</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-300" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/sonstige"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isSonstActive, 'bg-purple-50 text-purple-700')}
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
                                    className={mobileLinkClasses(isVmtActive, 'bg-teal-50 text-teal-800')}
                                    aria-current={isVmtActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isVmtActive ? 'bg-teal-100 text-teal-800' : 'bg-teal-50 text-teal-700 group-hover:bg-teal-100'}`}>
                                        <FaCamera size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isVmtActive ? 'text-teal-800' : 'text-slate-900 group-hover:text-teal-700'}`}>VMT</span>
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-500" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/minderwert"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isMinderwertActive, 'bg-indigo-50 text-indigo-800')}
                                    aria-current={isMinderwertActive ? 'page' : undefined}
                                >
                                    <span className={`flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${isMinderwertActive ? 'bg-indigo-100 text-indigo-800' : 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100'}`}>
                                        <FaMoneyBill size={20} aria-hidden="true" />
                                    </span>
                                    <span className={`font-semibold ${isMinderwertActive ? 'text-indigo-800' : 'text-slate-900 group-hover:text-indigo-700'}`}>Minderwert</span>
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
