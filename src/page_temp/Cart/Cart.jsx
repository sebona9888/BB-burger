import React from 'react';
// Path kana '../../context/useCart' tti jijjiiri
import { useCart } from '../../context/useCart';
import CartItem from '../../components/CartItem/CartItem';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQty, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    return (
        <div className="cart-page fade-in">
            <h1>Korboo Keessan</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Korboon keessan duwwaa dha.</p>
                    <button onClick={() => navigate('/menu')} className="go-back-btn">
                        Menu-tti Deebi'i
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-list">
                        {cartItems.map(item => (
                            <CartItem
                                key={item._id} // 'id' irra '_id' fayyadamuun filatamaa dha
                                item={item}
                                updateQty={updateQty}
                                removeItem={removeItem}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Waliigala: {totalPrice.toLocaleString()} ETB</h3>
                        <button
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Kaffaltii Raawwadhu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;