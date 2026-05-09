import React from 'react';
import './CartItem.css';

const CartItem = ({ item, updateQty, removeItem }) => {
    const itemId = item._id || item.id;

    return (
        <div className="cart-item">
            <div className="cart-item-img">
                <img src={item.img || item.image} alt={item.name} />
            </div>
            <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>{item.price} ETB</p>
            </div>
            <div className="cart-item-qty">
                <button onClick={() => updateQty(itemId, -1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(itemId, 1)}>+</button>
            </div>
            <div className="cart-item-total">
                {(item.price * item.qty).toLocaleString()} ETB
            </div>
            <button className="remove-btn" onClick={() => removeItem(itemId)}>
                🗑️
            </button>
        </div>
    );
};

export default CartItem;