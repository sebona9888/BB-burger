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

    const [customerInfo, setCustomerInfo] = useState({
        fullName: '',
        phone: '',
        address: ''
    });

    const handleCopy = (text, bank) => {
        navigator.clipboard.writeText(text);
        setCopied(bank);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large! Please upload image less than 5MB.');
                return;
            }
            setScreenshot(file);
            console.log('📎 File selected:', file.name, (file.size / 1024).toFixed(0), 'KB');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentConfirm = async () => {
        // Validate customer information
        if (!customerInfo.fullName) {
            alert('Please enter your full name!');
            return;
        }
        if (!customerInfo.phone) {
            alert('Please enter your phone number!');
            return;
        }
        if (!customerInfo.address) {
            alert('Please enter your delivery address!');
            return;
        }

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
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userEmail = userInfo?.user?.email || userInfo?.email || 'guest@example.com';

            console.log('📤 Step 1: Uploading to Cloudinary...');

            // Upload to Cloudinary
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', screenshot);
            cloudinaryFormData.append('upload_preset', 'beebboo_uploads');
            cloudinaryFormData.append('folder', 'beebboo-orders');

            const cloudinaryResponse = await fetch(
                'https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload',
                { method: 'POST', body: cloudinaryFormData }
            );

            const cloudinaryData = await cloudinaryResponse.json();

            if (!cloudinaryResponse.ok || !cloudinaryData.secure_url) {
                console.error('Cloudinary error:', cloudinaryData);
                throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
            }

            const screenshotUrl = cloudinaryData.secure_url;
            console.log('✅ Cloudinary upload success:', screenshotUrl);

            // Save order to backend
            console.log('📤 Step 2: Saving order to backend...');

            const orderData = {
                fullName: customerInfo.fullName,
                phone: customerInfo.phone,
                address: customerInfo.address,
                email: userEmail,
                paymentMethod: 'Bank Transfer',
                totalPrice: totalPrice,
                items: cartItems.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    _id: item._id
                })),
                screenshot: screenshotUrl
            };

            const response = await axios.post(
                'https://beebboo-backend.onrender.com/api/orders',
                orderData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('✅ Order saved:', response.data);

            // ✅ SUCCESS - Clear cart, show alert, redirect to my orders
            clearCart();
            alert('Order placed successfully! 🍔');
            navigate('/my-orders');

        } catch (error) {
            console.error('❌ Payment error:', error);

            let errorMessage = 'Payment failed. ';
            if (error.message.includes('Cloudinary')) {
                errorMessage = 'Image upload failed. Please try again with a different image.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = error.message || 'Please try again.';
            }

            alert(`Order failed: ${errorMessage}`);
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

            {/* Customer Information Form */}
            <div className="customer-info-section">
                <h3>📋 Delivery Information</h3>
                <div className="customer-form">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={customerInfo.fullName}
                        onChange={handleInputChange}
                        required
                        className="customer-input"
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="customer-input"
                    />
                    <textarea
                        name="address"
                        placeholder="Delivery Address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        className="customer-textarea"
                    />
                </div>
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
                {screenshot && (
                    <p className="file-name">
                        ✓ Selected: {screenshot.name} ({(screenshot.size / 1024).toFixed(0)} KB)
                    </p>
                )}
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