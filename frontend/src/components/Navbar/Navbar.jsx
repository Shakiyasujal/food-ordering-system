import React, { useEffect, useState } from 'react';
import { GiChefToque } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    FiHome,
    FiBook,
    FiStar,
    FiPhone,
    FiShoppingCart,
    FiMenu,
    FiX,
    FiKey,
    FiLogOut,
    FiPackage
} from 'react-icons/fi';

import { useCart } from '../../CartContext/CartContext';
import Login from '../Login/Login';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { totalItems } = useCart();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('loginData')));

    useEffect(() => {
        setShowLoginModal(location.pathname === '/login');
        setIsAuthenticated(Boolean(localStorage.getItem('loginData')));
    }, [location.pathname]);

    const handleLoginSuccess = () => {
        localStorage.setItem('loginData', JSON.stringify({ loggedIn: true }));
        setIsAuthenticated(true);
        navigate('/');
    };

    const handleLogout = () => {
        localStorage.removeItem('loginData');
        setIsAuthenticated(false);
    };

    const navLinks = [
        { name: 'Home', to: '/', icon: <FiHome /> },
        { name: 'Menu', to: '/menu', icon: <FiBook /> },
        { name: 'About', to: '/about', icon: <FiStar /> },
        { name: 'Contact', to: '/contact', icon: <FiPhone /> },
        ...(isAuthenticated ? [
            { name: 'My Order', to: '/myOrder', icon: <FiPackage /> }
        ] : [])
    ];

    const renderDesktopAuthButton = () => (
        isAuthenticated ? (
            <button
                onClick={handleLogout}
                className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-amber-600 to-amber-700 text-[#2D1B0E]
                rounded-2xl font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform
                hover:scale-[1.02] border-2 border-amber-600/20 flex items-center space-x-2 shadow-md shadow-amber-900/20
                text-sm"
            >
                <FiLogOut className='text-base lg:text-lg' />
                <span>Logout</span>
            </button>
        ) : (
            <button
                onClick={() => navigate('/login')}
                className="px-3 lg:px-4 py-1.5 lg:py-2 bg-gradient-to-br from-amber-600 to-amber-700 text-[#2D1B0E]
                rounded-2xl font-bold hover:shadow-lg hover:shadow-amber-600/40 transition-all transform
                hover:scale-[1.02] border-2 border-amber-600/20 flex items-center space-x-2 shadow-md shadow-amber-900/20
                text-sm"
            >
                <FiKey className='text-base lg:text-lg' />
                <span>Login</span>
            </button>
        )
    );

    const renderMobileAuthButton = () => (
        isAuthenticated ? (
            <button
                onClick={handleLogout}
                className='w-full px-4 py-3 bg-gradient-to-br from-amber-500 to-amber-700
                text-[#2D1B0E] rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm'
            >
                <FiLogOut />
                <span>Logout</span>
            </button>
        ) : (
            <button
                onClick={() => {
                    navigate('/login');
                    setIsOpen(false);
                }}
                className='w-full px-4 py-3 bg-gradient-to-br from-amber-500 to-amber-700
                text-[#2D1B0E] rounded-xl font-semibold flex items-center justify-center space-x-2 text-sm'
            >
                <FiKey />
                <span>Login</span>
            </button>
        )
    );

    return (
        <nav className='bg-[#2d1b0e] text-white shadow-lg sticky top-0 z-50'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='flex justify-between items-center h-20'>

                    {/* Logo */}
                    <NavLink to='/' className='flex items-center space-x-2'>
                        <GiChefToque className='text-3xl text-amber-500' />
                        <span className='text-2xl font-semibold text-amber-400 underline-'>Mitho-Munch</span>
                    </NavLink>

                    {/* Hamburger menu */}
                    <div className='md:hidden'>
                        <button onClick={() => setIsOpen(!isOpen)} className='text-amber-400 text-2xl'>
                            {isOpen ? <FiX /> : <FiMenu />}
                        </button>
                    </div>

                    {/* Desktop Nav */}
                    <div className='hidden md:flex space-x-4 items-center'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 font-medium ${isActive
                                        ? 'bg-amber-800 text-white shadow-md'
                                        : 'text-amber-300 hover:bg-amber-700/40 hover:text-white'}`
                                }
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}

                        {/* Cart */}
                        <NavLink to='/cart' className='relative text-amber-400 hover:text-amber-300 text-2xl'>
                            <FiShoppingCart />
                            {totalItems > 0 && (
                                <span className='absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                                    {totalItems}
                                </span>
                            )}
                        </NavLink>

                        {/* Auth Button */}
                        {renderDesktopAuthButton()}
                    </div>
                </div>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className='md:hidden mt-2 space-y-2 pb-4'>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className='flex items-center space-x-3 px-4 py-3 rounded-xl bg-amber-800/30 hover:bg-amber-800 text-white transition'
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </NavLink>
                        ))}

                        <NavLink
                            to='/cart'
                            onClick={() => setIsOpen(false)}
                            className='flex items-center space-x-3 px-4 py-3 rounded-xl bg-amber-800/30 hover:bg-amber-800 text-white transition relative'
                        >
                            <FiShoppingCart />
                            <span>Cart</span>
                            {totalItems > 0 && (
                                <span className='absolute -top-1 -right-2 bg-amber-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center'>
                                    {totalItems}
                                </span>
                            )}
                        </NavLink>

                        {renderMobileAuthButton()}
                    </div>
                )}

                {/* Login Modal */}
                {showLoginModal && (
                    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
                        <div className='bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] rounded-xl p-6 w-full max-w-sm border-4 border-amber-700/30 shadow-2xl relative'>
                            <button onClick={() => navigate('/')} className='absolute top-2 right-3 text-amber-500 hover:text-amber-300 text-2xl'>
                                &times;
                            </button>
                            <h2 className='text-xl font-bold text-center mb-4 bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent'>
                                Login
                            </h2>
                            <Login onLoginSuccess={handleLoginSuccess} onClose={() => navigate('/')} />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
