import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Analytics.css';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://beebboo-backend.onrender.com/api/analytics', {
            headers: { 'admin-secret': 'admin123' }
        })
            .then(res => { setData(res.data); setLoading(false); })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div>Loading analytics...</div>;

    return (
        <div className="analytics-page">
            <h1>📊 Sales Analytics</h1>
            <div className="stats-grid">
                <div className="stat">Total Orders: <strong>{data.totalOrders}</strong></div>
                <div className="stat">Revenue: <strong>{data.totalRevenue} ETB</strong></div>
                <div className="stat">Pending: <strong>{data.pendingOrders}</strong></div>
                <div className="stat">Top Burger: <strong>{data.topBurger}</strong></div>
            </div>
            <h3>Recent Orders</h3>
            <ul>
                {data.recentOrders.map(order => (
                    <li key={order._id}>{order.fullName} – {order.totalPrice} ETB – {order.status}</li>
                ))}
            </ul>
        </div>
    );
};

export default Analytics;