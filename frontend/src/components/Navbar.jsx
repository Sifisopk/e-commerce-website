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
    "flex w-full items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors";

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
        <Link
            to='/cart'
            aria-label='Cart'
            className='relative group text-gray-700 hover:text-red-600 transition duration-300 ease-in-out'
        >
            <ShoppingCart className='inline-block mr-1 group-hover:text-red-600' size={22} />
            <span className='hidden md:inline'>Cart</span>
            {cart.length > 0 && (
                <span className='absolute -top-2 -left-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-red-500 transition duration-300 ease-in-out'>
                    {cart.length}
                </span>
            )}
        </Link>
    );

    return (
        <header className='fixed top-0 left-0 w-full bg-white shadow-sm z-40 transition-all duration-300 border-b border-gray-200'>
            <div className='container mx-auto px-4 py-3'>
                <div className='flex justify-between items-center gap-2'>
                    <Link to='/' className='text-2xl font-bold text-red-600 flex items-center'>
                        Superfineboy
                    </Link>

                    {/* start of desktop nav (md and up) */}
                    <nav className='hidden md:flex items-center gap-4'>
                        <Link
                            to='/track-order'
                            className='flex items-center text-gray-700 hover:text-red-600 transition duration-300 ease-in-out'
                        >
                            <PackageSearch className='mr-1' size={18} />
                            Track Order
                        </Link>

                        {cartLink}

                        {isAdmin && (
                            <Link
                                to='/secret-dashboard'
                                className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-medium transition duration-300 ease-in-out flex items-center'
                            >
                                <Lock className='inline-block mr-1' size={18} />
                                Dashboard
                            </Link>
                        )}

                        {/* start of logged in as (desktop) */}
                        {user && (
                            <div className='max-w-[160px] lg:max-w-[240px] text-right leading-tight' title={user.email}>
                                <p className='text-xs text-gray-500'>Logged in as</p>
                                <p className='truncate text-sm font-medium text-gray-900'>{user.email}</p>
                            </div>
                        )}
                        {/* end of logged in as (desktop) */}

                        {user ? (
                            <button
                                className='bg-gray-900 hover:bg-black text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                onClick={logout}
                            >
                                <LogOut size={18} />
                                <span className='ml-2'>Log out</span>
                            </button>
                        ) : (
                            <>
                                <Link
                                    to='/signup'
                                    className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <UserPlus className='mr-2' size={18} />
                                    Sign up
                                </Link>
                                <Link
                                    to='/login'
                                    className='border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out'
                                >
                                    <LogIn className='mr-2' size={18} />
                                    Login
                                </Link>
                            </>
                        )}
                    </nav>
                    {/* end of desktop nav */}

                    {/* start of mobile controls (below md): cart stays outside the hamburger */}
                    <div className='flex md:hidden items-center gap-4' ref={menuRef}>
                        {cartLink}

                        <button
                            type='button'
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            aria-controls='mobile-menu'
                            className='p-1.5 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500'
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {menuOpen && (
                            <div
                                id='mobile-menu'
                                className='absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-lg'
                            >
                                <div className='py-2 divide-y divide-gray-100'>
                                    {/* start of logged in as */}
                                    {user && (
                                        <div className='px-4 py-3'>
                                            <p className='text-xs text-gray-500'>Logged in as</p>
                                            <p className='text-sm font-medium text-gray-900 break-all'>{user.email}</p>
                                        </div>
                                    )}
                                    {/* end of logged in as */}

                                    <div>
                                        <Link to='/track-order' className={mobileItem}>
                                            <PackageSearch size={20} />
                                            Track Order
                                        </Link>

                                        {isAdmin && (
                                            <Link to='/secret-dashboard' className={mobileItem}>
                                                <Lock size={20} />
                                                Dashboard
                                            </Link>
                                        )}
                                    </div>

                                    <div>
                                        <a href={SUPPORT_HREF} className={mobileItem}>
                                            <LifeBuoy size={20} />
                                            Contact Support
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