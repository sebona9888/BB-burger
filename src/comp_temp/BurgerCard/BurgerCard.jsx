import React from 'react';
import './BurgerCard.css';

const BurgerCard = ({ name, price, desc, img }) => {
    return (
        <div className="burger-card">
            <div className="burger-image">
                <img src={img} alt={name} />
            </div>
            <div className="burger-info">
                <h3 className="burger-name">{name}</h3>
                <p className="burger-desc">{desc}</p>
                <div className="burger-footer">
                    <span className="burger-price">{price} ETB</span>
                    <button className="add-to-cart">Ajajadhu</button>
                </div>
            </div>
        </div>
    );
};

export default BurgerCard;