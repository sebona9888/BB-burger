import React, { useState } from 'react';
import { useCart } from '../../context/useCart';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const [copied, setCopied] = useState("");
    const [processing, setProcessing] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const navigate = useNavigate();

    const handleCopy = (text, bank) => {
        navigator.clipboard.writeText(text);
        setCopied(bank);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large! Please upload image less than 5MB.');
                return;
            }
            setScreenshot(file);
        }
    };

    const handlePaymentConfirm = async () => {
        // Validation
        if (!screenshot) {
            alert('Please upload payment screenshot!');
            return;
        }

        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            navigate('/menu');
            return;
        }

        setProcessing(true);

        try {
            // Create form data for backend
            const formData = new FormData();

            // Required fields by backend
            formData.append('fullName', 'Beebboo Customer');
            formData.append('phone', '0902989488');
            formData.append('address', 'Addis Ababa, Ethiopia');
            formData.append('paymentMethod', 'Bank Transfer');
            formData.append('totalPrice', totalPrice.toString());
            formData.append('items', JSON.stringify(cartItems.map(item => ({
                _id: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }))));
            formData.append('screenshot', screenshot);

            console.log('📤 Sending order to backend...');
            console.log('Order details:', {
                totalPrice,
                itemCount: cartItems.length,
                items: cartItems.map(i => ({ name: i.name, quantity: i.quantity }))
            });

            const response = await axios.post(
                'https://beebboo-backend.onrender.com/api/orders',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 30000
                }
            );

            console.log('✅ Order response:', response.data);

            if (response.data) {
                clearCart();
                alert('Order placed successfully! 🍔\nWe will contact you soon.');
                navigate('/');
            }
        } catch (error) {
            console.error('❌ Payment error:', error);

            if (error.code === 'ECONNABORTED') {
                alert('Request timeout. Please check your connection and try again.');
            } else if (error.response) {
                console.error('Server response:', error.response.data);
                const errorMsg = error.response.data?.message || error.response.data?.error || 'Server error. Please try again.';
                alert(`Order failed: ${errorMsg}`);
            } else if (error.request) {
                alert('No response from server. Please check your internet connection.');
            } else {
                alert(`Payment failed: ${error.message}`);
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="payment-page-onyx">
            {copied && <div className="toast-onyx">COPIED: {copied}</div>}

            <div className="header-onyx">
                <h1>PREMIUM SETTLEMENT</h1>
                <p>SECURE YOUR ORDER BY SETTLING THROUGH OUR CHANNELS</p>
            </div>

            {/* Payment Cards */}
            <div className="onyx-grid">
                <div className="onyx-card" onClick={() => handleCopy("1000421244808", "CBE")}>
                    <div className="onyx-inner">
                        <span className="onyx-label">COMMERCIAL BANK</span>
                        <h2 className="onyx-number">1000421244808</h2>
                        <p className="onyx-holder">Beebboo Beyana</p>
                        <div className="onyx-badge">VERIFIED</div>
                    </div>
                </div>

                <div className="onyx-card" onClick={() => handleCopy("0902989488", "Telebirr")}>
                    <div className="onyx-inner">
                        <span className="onyx-label">TELEBIRR DIGITAL</span>
                        <h2 className="onyx-number">0902989488</h2>
                        <p className="onyx-holder">Beebboo Beyana</p>
                        <div className="onyx-badge">INSTANT</div>
                    </div>
                </div>

                <div className="onyx-card" onClick={() => handleCopy("01320506080500", "Awash")}>
                    <div className="onyx-inner">
                        <span className="onyx-label">AWASH BANK</span>
                        <h2 className="onyx-number">01320506080500</h2>
                        <p className="onyx-holder">Beebboo Beyana</p>
                        <div className="onyx-badge">ACTIVE</div>
                    </div>
                </div>
            </div>

            {/* Screenshot Upload */}
            <div className="onyx-upload">
                <h3>UPLOAD PAYMENT SCREENSHOT</h3>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleFileChange}
                    className="screenshot-input"
                />
                {screenshot && <p className="file-name">✓ Selected: {screenshot.name}</p>}
            </div>

            {/* Contact Section */}
            <div className="onyx-verification">
                <div className="onyx-verify-inner">
                    <h3>ACTION: SEND DIRECT SCREENSHOT</h3>
                    <div className="onyx-social-row">
                        <a href="https://wa.me/251902989488" target="_blank" rel="noopener noreferrer" className="onyx-btn wa">WHATSAPP</a>
                        <a href="https://t.me/sebona_haile" target="_blank" rel="noopener noreferrer" className="onyx-btn tg">TELEGRAM</a>
                    </div>
                </div>
            </div>

            {/* Confirm Button */}
            <div className="onyx-confirm">
                <button
                    className="confirm-payment-btn"
                    onClick={handlePaymentConfirm}
                    disabled={processing}
                >
                    {processing ? 'Processing...' : 'Confirm Payment & Place Order'}
                </button>
            </div>
        </div>
    );
};

export default Payment;