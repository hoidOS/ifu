import Image from 'next/image';
import Link from 'next/link';
import logo from '../assets/logo/logo.png';
import { useRouter } from 'next/router';
import { FaBars, FaTimes } from 'react-icons/fa'
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

    const mobileLinkClasses = (isActive: boolean) =>
        `block rounded-md border-l-4 px-4 py-3 text-base font-semibold tracking-normal transition-colors duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 ${isActive
            ? 'border-primary-700 bg-primary-50 text-primary-800'
            : 'border-transparent text-slate-800 hover:bg-slate-100/70 hover:text-primary-800'
        }`

    const desktopLinkClasses = (isActive: boolean) =>
        `relative inline-flex items-center px-3 py-2 text-[0.95rem] font-medium tracking-normal transition-colors duration-200 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-primary-700 after:transition-opacity after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 ${isActive
            ? 'text-primary-800 after:opacity-100'
            : 'text-slate-600 after:opacity-0 hover:text-primary-800'
        }`

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
                            className="inline-flex rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                            aria-label="Zur STEINACKER Startseite"
                        >
                            <Image
                                src={logo}
                                alt="Steinacker"
                                width={238}
                                height={54}
                                className="h-auto w-36 object-contain md:w-44"
                                priority
                            />
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center">
                        <ul className="flex items-center gap-2 text-slate-600">
                            <li>
                                <Link
                                    href="/bremsweg"
                                    className={desktopLinkClasses(isBremswegActive)}
                                    aria-current={isBremswegActive ? 'page' : undefined}
                                >
                                    Anhalt
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/konstantfahrt"
                                    className={desktopLinkClasses(isKonstantfahrtActive)}
                                    aria-current={isKonstantfahrtActive ? 'page' : undefined}
                                >
                                    Konstant
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sonstige"
                                    className={desktopLinkClasses(isSonstActive)}
                                    aria-current={isSonstActive ? 'page' : undefined}
                                >
                                    Sonstiges
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/vmt"
                                    className={desktopLinkClasses(isVmtActive)}
                                    aria-current={isVmtActive ? 'page' : undefined}
                                >
                                    VMT
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/minderwert"
                                    className={desktopLinkClasses(isMinderwertActive)}
                                    aria-current={isMinderwertActive ? 'page' : undefined}
                                >
                                    Minderwert
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
                            className="inline-flex rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2"
                            aria-label="Zur STEINACKER Startseite"
                        >
                            <Image
                                src={logo}
                                alt="STEINACKER"
                                width={238}
                                height={54}
                                className="h-auto w-36 object-contain"
                                priority
                            />
                            <span id="mobile-menu-title" className="sr-only">STEINACKER</span>
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
                                    className={mobileLinkClasses(isBremswegActive)}
                                    aria-current={isBremswegActive ? 'page' : undefined}
                                >
                                    Anhaltevorgang
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-200" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/konstantfahrt"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isKonstantfahrtActive)}
                                    aria-current={isKonstantfahrtActive ? 'page' : undefined}
                                >
                                    Konstantfahrt
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-300" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/sonstige"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isSonstActive)}
                                    aria-current={isSonstActive ? 'page' : undefined}
                                >
                                    Sonstiges
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-400" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/vmt"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isVmtActive)}
                                    aria-current={isVmtActive ? 'page' : undefined}
                                >
                                    VMT
                                </Link>
                            </li>
                            <li className={nav ? "opacity-100 transform translate-x-0 transition-all duration-500 delay-500" : "opacity-0 transform translate-x-4"}>
                                <Link
                                    href="/minderwert"
                                    onClick={closeNav}
                                    className={mobileLinkClasses(isMinderwertActive)}
                                    aria-current={isMinderwertActive ? 'page' : undefined}
                                >
                                    Minderwert
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
