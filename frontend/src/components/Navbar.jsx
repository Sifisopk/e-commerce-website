import { useEffect, useRef, useState } from "react";
import {
    ShoppingCart, UserPlus, LogIn, LogOut, Lock, PackageSearch, Menu, X, LifeBuoy,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { mailtoHref } from "../config/contact";

const SUPPORT_HREF = mailtoHref("Support request"); // details live in config/contact.js

const mobileItem =
    "flex w-full items-center gap-3 px-5 py-4 text-left text-lg font-semibold text-ink transition-colors hover:text-brand";
const desktopLink =
    "flex items-center gap-1.5 text-[15px] font-medium text-ink transition-colors hover:text-brand";

const Navbar = () => {
    const { user, logout } = useUserStore();
    const isAdmin = user?.role === "admin";
    const { cart } = useCartStore();

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();

    // start of close menu on navigation
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);
    // end of close menu on navigation

    // start of close menu on outside tap / Escape
    useEffect(() => {
        if (!menuOpen) return;
        const onPointerDown = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onKeyDown = (e) => e.key === "Escape" && setMenuOpen(false);
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("touchstart", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("touchstart", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen]);
    // end of close menu on outside tap / Escape

    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    const cartLink = user && (
        <Link to='/cart' aria-label='Cart' className={`relative p-2 md:p-0 ${desktopLink}`}>
            <ShoppingCart size={22} />
            <span className='hidden md:inline'>Cart</span>
            {cart.length > 0 && (
                <span className='absolute left-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white md:-left-2 md:-top-2'>
                    {cart.length}
                </span>
            )}
        </Link>
    );

    return (
        <header className='sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between gap-2'>
                    <Link to='/' className='font-display text-2xl font-bold tracking-tight text-ink'>
                        Superfine<span className='text-brand'>boy</span>
                    </Link>

                    {/* start of desktop nav (md and up) */}
                    <nav className='hidden items-center gap-6 md:flex'>
                        <Link to='/track-order' className={desktopLink}>
                            <PackageSearch size={18} />
                            Track order
                        </Link>

                        {cartLink}

                        {isAdmin && (
                            <Link
                                to='/secret-dashboard'
                                className='flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black'
                            >
                                <Lock size={16} />
                                Dashboard
                            </Link>
                        )}

                        {/* start of logged in as (desktop) */}
                        {user && (
                            <div className='max-w-[160px] text-right leading-tight lg:max-w-[240px]' title={user.email}>
                                <p className='text-xs text-muted'>Logged in as</p>
                                <p className='truncate text-sm font-medium text-ink'>{user.email}</p>
                            </div>
                        )}
                        {/* end of logged in as (desktop) */}

                        {user ? (
                            <button
                                onClick={logout}
                                className='flex items-center gap-2 rounded-lg border border-ink px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white'
                            >
                                <LogOut size={16} />
                                Log out
                            </button>
                        ) : (
                            <>
                                <Link
                                    to='/login'
                                    className='flex items-center gap-2 rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink'
                                >
                                    <LogIn size={16} />
                                    Login
                                </Link>
                                <Link
                                    to='/signup'
                                    className='flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark'
                                >
                                    <UserPlus size={16} />
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                    {/* end of desktop nav */}

                    {/* start of mobile controls (below md): cart stays outside the hamburger */}
                    <div className='flex items-center gap-1 md:hidden' ref={menuRef}>
                        {cartLink}

                        <button
                            type='button'
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            aria-controls='mobile-menu'
                            className='rounded-lg p-2.5 text-ink hover:bg-surface focus:outline-none focus:ring-2 focus:ring-brand'
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {menuOpen && (
                            <div
                                id='mobile-menu'
                                className='absolute left-0 right-0 top-full border-b border-line bg-white shadow-lg'
                            >
                                <div className='divide-y divide-line py-1'>
                                    {/* start of logged in as */}
                                    {user && (
                                        <div className='px-5 py-4'>
                                            <p className='text-xs text-muted'>Logged in as</p>
                                            <p className='break-all text-sm font-medium text-ink'>{user.email}</p>
                                        </div>
                                    )}
                                    {/* end of logged in as */}

                                    <div>
                                        <Link to='/track-order' className={mobileItem}>
                                            <PackageSearch size={20} />
                                            Track order
                                        </Link>

                                        {isAdmin && (
                                            <Link to='/secret-dashboard' className={mobileItem}>
                                                <Lock size={20} />
                                                Dashboard
                                                <span className='ml-auto text-xs font-semibold tracking-wider text-brand'>
                                                    ADMIN ONLY
                                                </span>
                                            </Link>
                                        )}
                                    </div>

                                    <div>
                                        <a href={SUPPORT_HREF} className={mobileItem}>
                                            <LifeBuoy size={20} />
                                            Contact support
                                        </a>
                                    </div>

                                    <div>
                                        {user ? (
                                            <button type='button' onClick={handleLogout} className={mobileItem}>
                                                <LogOut size={20} />
                                                Log out
                                            </button>
                                        ) : (
                                            <>
                                                <Link to='/login' className={mobileItem}>
                                                    <LogIn size={20} />
                                                    Login
                                                </Link>
                                                <Link to='/signup' className={mobileItem}>
                                                    <UserPlus size={20} />
                                                    Sign up
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* end of mobile controls */}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
