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
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large! Please upload image less than 5MB.');
                return;
            }
            setScreenshot(file);
        }
    };

    const handlePaymentConfirm = async () => {
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
            // Get logged-in user's email for order history
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userEmail = userInfo?.user?.email || userInfo?.email || 'guest@example.com';

            // Step 1: Upload screenshot to Cloudinary using unsigned preset
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', screenshot);
            cloudinaryFormData.append('upload_preset', 'beebboo_uploads');
            cloudinaryFormData.append('folder', 'beebboo-orders');

            console.log('📤 Uploading to Cloudinary...');
            console.log('File:', screenshot.name, 'Size:', screenshot.size);

            const cloudinaryResponse = await fetch(
                'https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload',
                {
                    method: 'POST',
                    body: cloudinaryFormData
                }
            );

            const cloudinaryData = await cloudinaryResponse.json();

            console.log('Cloudinary response:', cloudinaryData);

            if (!cloudinaryResponse.ok || cloudinaryData.error) {
                console.error('Cloudinary upload failed:', cloudinaryData.error);
                throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
            }

            if (!cloudinaryData.secure_url) {
                throw new Error('No secure_url returned from Cloudinary');
            }

            const screenshotUrl = cloudinaryData.secure_url;
            console.log('✅ Uploaded to Cloudinary:', screenshotUrl);

            // Step 2: Save order to backend with user email
            const orderData = {
                fullName: 'Beebboo Customer',
                phone: '0902989488',
                address: 'Addis Ababa, Ethiopia',
                email: userEmail,  // ✅ Added for order history
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

            console.log('📤 Saving order to backend...');

            const response = await axios.post(
                'https://beebboo-backend.onrender.com/api/orders',
                orderData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 30000
                }
            );

            console.log('✅ Order response:', response.data);

            if (response.data) {
                clearCart();
                alert('Order placed successfully! 🍔');
                navigate('/');
            }
        } catch (error) {
            console.error('Payment error:', error);

            let errorMessage = 'Payment failed. ';
            if (error.message.includes('Cloudinary')) {
                errorMessage = 'Screenshot upload failed. Please check your Cloudinary preset configuration.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = error.message || 'Please try again.';
            }

            alert(`Order failed: ${errorMessage}`);
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

            <div className="onyx-verification">
                <div className="onyx-verify-inner">
                    <h3>ACTION: SEND DIRECT SCREENSHOT</h3>
                    <div className="onyx-social-row">
                        <a href="https://wa.me/251902989488" target="_blank" rel="noopener noreferrer" className="onyx-btn wa">WHATSAPP</a>
                        <a href="https://t.me/sebona_haile" target="_blank" rel="noopener noreferrer" className="onyx-btn tg">TELEGRAM</a>
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