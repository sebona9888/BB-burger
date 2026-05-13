import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Analytics.css';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topBurgers, setTopBurgers] = useState([]);

    useEffect(() => {
        axios.get('https://beebboo-backend.onrender.com/api/analytics', {
            headers: { 'admin-secret': 'admin123' }
        })
            .then(res => {
                setData(res.data);
                // Calculate top burgers from recent orders (simple aggregation)
                const burgerSales = {};
                res.data.recentOrders?.forEach(order => {
                    order.items?.forEach(item => {
                        const name = item.name;
                        burgerSales[name] = (burgerSales[name] || 0) + item.quantity;
                    });
                });
                const sorted = Object.entries(burgerSales)
                    .map(([name, sales]) => ({ name, sales }))
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5);
                setTopBurgers(sorted);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div>Loading analytics...</div>;

    // Status distribution
    const statusCount = {
        Pending: data.pendingOrders || 0,
        Delivered: data.recentOrders?.filter(o => o.status === 'Delivered').length || 0,
        Cancelled: data.recentOrders?.filter(o => o.status === 'Cancelled').length || 0
    };
    // For more accurate, you'd need total counts from backend; using recentOrders as sample.
    // For better, we'll add a simple bar chart with top 5 burgers from recent orders.

    const statusData = [
        { name: 'Pending', value: statusCount.Pending },
        { name: 'Delivered', value: statusCount.Delivered },
        { name: 'Cancelled', value: statusCount.Cancelled }
    ].filter(s => s.value > 0);
    const COLORS = ['#ff9800', '#4caf50', '#f44336'];

    return (
        <div className="analytics-page">
            <h1>📊 Sales Analytics</h1>
            <div className="stats-grid">
                <div className="stat">Total Orders: <strong>{data.totalOrders}</strong></div>
                <div className="stat">Revenue: <strong>{data.totalRevenue} ETB</strong></div>
                <div className="stat">Pending: <strong>{data.pendingOrders}</strong></div>
                <div className="stat">Top Burger: <strong>{data.topBurger}</strong></div>
            </div>

            {/* Bar Chart: Top Selling Burgers (based on recent orders) */}
            {topBurgers.length > 0 && (
                <div className="chart-container">
                    <h3>🍔 Top Selling Burgers (Last 5 orders)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topBurgers}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#00897b" name="Units Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Pie Chart: Order Status Distribution */}
            <div className="chart-container">
                <h3>📦 Order Status (Based on recent orders)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
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