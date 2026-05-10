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
        setScreenshot(e.target.files[0]);
    };

    const handlePaymentConfirm = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

        if (!userInfo.user?.name) {
            alert('Please login to place order!');
            navigate('/login');
            return;
        }

        if (!screenshot) {
            alert('Please upload payment screenshot!');
            return;
        }

        setProcessing(true);
        try {
            const formData = new FormData();
            formData.append('fullName', userInfo.user.name);
            formData.append('phone', userInfo.user.phone || 'Not provided');
            formData.append('address', userInfo.user.address || 'Not provided');
            formData.append('paymentMethod', 'Bank Transfer');
            formData.append('totalPrice', totalPrice.toString());
            formData.append('items', JSON.stringify(cartItems));
            formData.append('screenshot', screenshot);

            const response = await axios.post('https://beebboo-backend.onrender.com/api/orders', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data) {
                clearCart();
                alert('Order placed successfully! 🍔');
                navigate('/');
            }
        } catch (error) {
            console.error('Payment error:', error.response?.data || error);
            alert(error.response?.data?.message || 'Payment failed. Please try again.');
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
                    accept="image/*"
                    onChange={handleFileChange}
                    className="screenshot-input"
                />
                {screenshot && <p className="file-name">Selected: {screenshot.name}</p>}
            </div>

            <div className="onyx-verification">
                <div className="onyx-verify-inner">
                    <h3>ACTION: SEND DIRECT SCREENSHOT</h3>
                    <div className="onyx-social-row">
                        <a href="https://wa.me/251902989488" target="_blank" className="onyx-btn wa">WHATSAPP</a>
                        <a href="https://t.me/sebona_haile" target="_blank" className="onyx-btn tg">TELEGRAM</a>
                    </div>
                </div>
            </div>

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