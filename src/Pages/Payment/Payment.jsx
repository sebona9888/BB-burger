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
            // Limit to 2MB for faster upload
            if (file.size > 2 * 1024 * 1024) {
                alert('Please upload image smaller than 2MB for faster processing');
                return;
            }
            setScreenshot(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentConfirm = async () => {
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

            // Step 1: Compress image before upload for faster processing
            let compressedFile = screenshot;
            if (screenshot.size > 500 * 1024) { // If larger than 500KB
                compressedFile = await compressImage(screenshot);
            }

            // Upload to Cloudinary with shorter timeout
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', compressedFile);
            cloudinaryFormData.append('upload_preset', 'beebboo_uploads');
            cloudinaryFormData.append('folder', 'beebboo-orders');

            const cloudinaryResponse = await fetch(
                'https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload',
                {
                    method: 'POST',
                    body: cloudinaryFormData,
                    signal: AbortSignal.timeout(30000) // 30 second timeout for upload
                }
            );

            const cloudinaryData = await cloudinaryResponse.json();

            if (!cloudinaryResponse.ok || cloudinaryData.error) {
                throw new Error(cloudinaryData.error?.message || 'Cloudinary upload failed');
            }

            const screenshotUrl = cloudinaryData.secure_url;

            // Step 2: Save order - send minimal data
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
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 20000 // 20 second timeout for order
                }
            );

            if (response.data) {
                clearCart();
                alert('Order placed successfully! 🍔');
                navigate('/');
            }
        } catch (error) {
            console.error('Payment error:', error);

            if (error.name === 'AbortError' || error.message?.includes('timeout')) {
                alert('Network slow. Please try again with smaller image.');
            } else {
                alert('Payment failed. Please try again.');
            }
        } finally {
            setProcessing(false);
        }
    };

    // Image compression helper function
    const compressImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const maxWidth = 800;
                    const scale = maxWidth / img.width;
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                    }, 'image/jpeg', 0.7);
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    return (
        <div className="payment-page-onyx">
            {copied && <div className="toast-onyx">COPIED: {copied}</div>}

            <div className="header-onyx">
                <h1>PREMIUM SETTLEMENT</h1>
                <p>SECURE YOUR ORDER BY SETTLING THROUGH OUR CHANNELS</p>
            </div>

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
                {screenshot && <p className="file-name">✓ Selected: {screenshot.name} ({Math.round(screenshot.size / 1024)} KB)</p>}
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