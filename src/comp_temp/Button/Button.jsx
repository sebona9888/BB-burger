import React from 'react';
import './Button.css';

const Button = ({ text, onClick, type = "primary", icon }) => {
    return (
        <button className={`custom-btn ${type}`} onClick={onClick}>
            {icon && <span className="btn-icon">{icon}</span>}
            {text}
        </button>
    );
};

export default Button;