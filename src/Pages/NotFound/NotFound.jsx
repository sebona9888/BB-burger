import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="error-code">404</h1>
                <div className="burger-icon">🍔❌</div>
                <h2>Dhiifama! Burger Kana Hin Argannu</h2>
                <p>Fuulli ati barbaaddus ta'e burger-ri kun sirriitti hin argamne.</p>
                <Link to="/" className="back-home-btn">
                    Gara Home Deebi'i
                </Link>
            </div>
        </div>
    );
};

export default NotFound;