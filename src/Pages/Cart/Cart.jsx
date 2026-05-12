import React from 'react';
import { useCart } from '../../context/useCart';
import CartItem from '../../components/CartItem/CartItem';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Cart.css';

const Cart = () => {
    const { cartItems, updateQty, removeItem, totalPrice } = useCart();
    const navigate = useNavigate();

    const handleUpdateQty = (id, newQty) => {
        updateQty(id, newQty);
        toast.success('Cart updated!', {
            position: 'top-center',
            duration: 2000,
        });
    };

    const handleRemoveItem = (id) => {
        removeItem(id);
        toast.success('Item removed!', {
            position: 'top-center',
            duration: 2000,
        });
    };

    const handlePayment = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!', {
                position: 'top-center',
                duration: 3000,
            });
            return;
        }
        navigate('/payment');  // ✅ Direct to payment page
    };

    return (
        <div className="cart-page fade-in">
            <h1>Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty.</p>
                    <button onClick={() => navigate('/menu')} className="go-back-btn">
                        Browse Menu
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
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>{totalPrice.toLocaleString()} ETB</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>Free</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>{totalPrice.toLocaleString()} ETB</span>
                        </div>
                        <button className="checkout-btn" onClick={handlePayment}>
                            Proceed to Payment 💳
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;