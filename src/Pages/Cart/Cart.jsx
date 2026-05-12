import React from 'react';
import { useCart } from '../../context/useCart';
import CartItem from '../../components/CartItem/CartItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQty, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    // Handlers with Toasts
    const handleUpdateQty = (id, newQty) => {
        updateQty(id, newQty);
        toast.success('Cart updated successfully!', {
            position: 'top-center',
            duration: 2000,
        });
    };

    const handleRemoveItem = (id) => {
        removeItem(id);
        toast.success('Item removed from cart!', {
            position: 'top-center',
            duration: 2000,
        });
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!', {
                position: 'top-center',
                duration: 3000,
            });
            return;
        }
        navigate('/payment');
    };

    return (
        <div className="cart-page fade-in">
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/menu')} className="go-back-btn">
                        Back to Menu
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-list">
                        {cartItems.map(item => (
                            <CartItem
                                key={item._id}
                                item={item}
                                updateQty={handleUpdateQty}
                                removeItem={handleRemoveItem}
                            />
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Total: {totalPrice.toLocaleString()} ETB</h3>
                        <button
                            className="checkout-btn"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;