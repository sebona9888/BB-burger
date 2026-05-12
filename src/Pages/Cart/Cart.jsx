import React from 'react';
import { useCart } from '../../context/useCart';
import CartItem from '../../components/CartItem/CartItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // ✅ Dabalata
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQty, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    // ✅ Handlers with Toasts
    const handleUpdateQty = (id, newQty) => {
        updateQty(id, newQty);
        toast.success('Korboon keessan haaromeera!');
    };

    const handleRemoveItem = (id) => {
        removeItem(id);
        toast.error('Nyaanni korboo keessaa haqameera!');
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Korboon keessan duwwaa dha!');
            return;
        }
        navigate('/checkout');
    };

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
                                key={item._id}
                                item={item}
                                // ✅ Custom handlers pass gochuu
                                updateQty={handleUpdateQty}
                                removeItem={handleRemoveItem}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Waliigala: {totalPrice.toLocaleString()} ETB</h3>
                        <button
                            className="checkout-btn"
                            onClick={handleCheckout} // ✅ Function haarawaa
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