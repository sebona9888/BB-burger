import React, { useState } from 'react';
import { useCart } from '../../context/useCart';
import './Checkout.css';
import { useCreateOrder } from '../../hooks/useOrders';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, totalPrice, clearCart } = useCart();
    const { mutate: createOrder, isPending } = useCreateOrder();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        paymentMethod: 'Cash'
    });

    const [screenshot, setScreenshot] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error("Korbofni keessan duwwaa dha!");
            return;
        }

        if (formData.paymentMethod !== 'Cash' && !screenshot) {
            toast.error("Maaloo, screenshot kaffaltii fe'aa!");
            return;
        }

        try {
            // Get logged-in user's email for order history
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const userEmail = userInfo?.user?.email || userInfo?.email || '';

            const data = new FormData();

            data.append('fullName', formData.fullName);
            data.append('phone', formData.phone);
            data.append('address', formData.address);
            data.append('email', userEmail);  // ✅ Added for order history
            data.append('paymentMethod', formData.paymentMethod);
            data.append('totalPrice', totalPrice);
            data.append('items', JSON.stringify(cartItems));

            if (screenshot) {
                data.append('screenshot', screenshot);
            }

            createOrder(data, {
                onSuccess: () => {
                    setPreview(null);
                    setScreenshot(null);
                    clearCart();
                    toast.success("Order milkiidhaan ergameera!");
                },
                onError: (err) => {
                    toast.error("Error: " + (err.response?.data?.message || err.message));
                }
            });
        } catch (err) {
            console.error("Submission Error:", err);
            toast.error("Wanti hin eegamne uumameera!");
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="fullName"
                    placeholder="Maqaa Guutuu"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                />
                <input
                    name="phone"
                    placeholder="Bilbila"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                />
                <textarea
                    name="address"
                    placeholder="Teessoo"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                />

                <div className="payment-section">
                    <label>Method Kaffaltii:</label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={(e) => {
                            setFormData({ ...formData, paymentMethod: e.target.value });
                            if (e.target.value === 'Cash') {
                                setScreenshot(null);
                                setPreview(null);
                            }
                        }}
                    >
                        <option value="Cash">Cash (Kaffaltii harkaatti)</option>
                        <option value="Telebirr">Telebirr</option>
                        <option value="CBE">CBE</option>
                        <option value="AbyssinaBE">Abyssina</option>
                    </select>
                </div>

                {formData.paymentMethod !== 'Cash' && (
                    <div className="file-upload">
                        <label>Screenshot Kaffaltii Fe'i:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                        {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Preview" style={{ width: '100px', marginTop: '10px', borderRadius: '8px' }} />
                            </div>
                        )}
                    </div>
                )}

                <button type="submit" disabled={isPending}>
                    {isPending ? "Ergamaa jira..." : `Order Now (${totalPrice} ETB)`}
                </button>
            </form>
        </div>
    );
};

export default Checkout;