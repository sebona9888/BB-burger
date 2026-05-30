import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }
        fetchUserOrders();
    }, [navigate]);

    const fetchUserOrders = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const token = userInfo?.token;

            // Fetch all orders (admin endpoint - needs token)
            const response = await axios.get('https://prime-backend.onrender.com/api/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'admin-secret': 'admin123'
                }
            });

            // Filter orders for current user by email
            const userEmail = userInfo?.user?.email || userInfo?.email;
            const userOrders = response.data.filter(order => order.email === userEmail);

            setOrders(userOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return <span className="status-badge pending">⏳ Pending</span>;
            case 'Processing':
                return <span className="status-badge processing">🔄 Processing</span>;
            case 'Delivered':
                return <span className="status-badge delivered">✅ Delivered</span>;
            case 'Cancelled':
                return <span className="status-badge cancelled">❌ Cancelled</span>;
            default:
                return <span className="status-badge pending">⏳ {status}</span>;
        }
    };

    if (loading) return <div className="order-history-loading">Loading your orders...</div>;

    return (
        <div className="order-history-container">
            <h1 className="order-history-title">📋 My Orders</h1>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <button onClick={() => navigate('/menu')} className="browse-menu-btn">
                        🍔 Browse Menu
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #{order._id.slice(-8)}</span>
                                    <span className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {getStatusBadge(order.status)}
                            </div>

                            <div className="order-items">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span>{item.name}</span>
                                        <span>x{item.quantity}</span>
                                        <span>{item.price * item.quantity} ETB</span>
                                    </div>
                                ))}
                            </div>

                            <div className="order-footer">
                                <div className="order-total">
                                    <strong>Total:</strong> {order.totalPrice} ETB
                                </div>
                                <div className="order-payment">
                                    <strong>Payment:</strong> {order.paymentMethod}
                                </div>
                                {order.screenshot && (
                                    <a href={order.screenshot} target="_blank" rel="noopener noreferrer" className="view-screenshot">
                                        📸 View Screenshot
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;