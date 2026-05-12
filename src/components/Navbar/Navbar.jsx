import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/useCart';
import { toast } from 'react-hot-toast'; // ✅ Dabalata
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const isAdmin = userInfo && (userInfo.isAdmin || userInfo.user?.isAdmin);

    // ✅ Logout function with Toast
    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        setIsOpen(false);
        toast.success('Logged out successfully! 👋'); // ✅ Toast dabalata
        navigate('/login');
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`overlay ${isOpen ? 'show' : ''}`}
                onClick={() => setIsOpen(false)}
            />

            <nav className="navbar">
                {/* Hamburger */}
                <div
                    className={`hamburger ${isOpen ? 'active' : ''}`}
                    onClick={() => setIsOpen(prev => !prev)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Logo */}
                <Link to="/" className="logo">
                    Beebboo <span>Burger</span>
                </Link>

                {/* Desktop menu */}
                <ul className="nav-desktop">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/menu">Menu</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <Link to="/profile">👤 Profile</Link>

                    {userInfo && (
                        <li><Link to="/my-orders">📋 My Orders</Link></li>
                    )}

                    {isAdmin && <li><Link to="/admin">Admin</Link></li>}

                    {!userInfo ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register" className="nav-btn">Register</Link></li>
                        </>
                    ) : (
                        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
                    )}
                </ul>

                {/* Cart */}
                <div className="cart">
                    <Link to="/cart">🛒 ({cartCount})</Link>
                </div>

                {/* MOBILE SIDEBAR */}
                <ul className={`sidebar ${isOpen ? 'open' : ''}`}>
                    <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
                    <li><Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link></li>
                    <li><Link to="/about" onClick={() => setIsOpen(false)}>About</Link></li>
                    <li><Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
                    <li><Link to="/profile" onClick={() => setIsOpen(false)}>👤 Profile</Link></li>
                    {userInfo && (
                        <li><Link to="/my-orders" onClick={() => setIsOpen(false)}>📋 My Orders</Link></li>
                    )}

                    {isAdmin && <li><Link to="/admin" onClick={() => setIsOpen(false)}>Admin</Link></li>}

                    {!userInfo ? (
                        <>
                            <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
                            <li><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
                        </>
                    ) : (
                        <li><button onClick={handleLogout}>Logout</button></li>
                    )}
                </ul>
            </nav>
        </>
    );
};

export default Navbar;