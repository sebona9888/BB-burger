import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell,
    LineChart, Line, CartesianGrid
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topBurgers, setTopBurgers] = useState([]);
    const [dailySales, setDailySales] = useState([]);

    useEffect(() => {
        axios.get('https://beebboo-backend.onrender.com/api/analytics', {
            headers: { 'admin-secret': 'admin123' }
        })
            .then(res => {
                setData(res.data);

                // ---- Top Selling Burgers (from recent orders) ----
                const burgerSales = {};
                res.data.recentOrders?.forEach(order => {
                    if (order.items) {
                        order.items.forEach(item => {
                            const name = item.name;
                            burgerSales[name] = (burgerSales[name] || 0) + (item.quantity || 1);
                        });
                    }
                });
                const sorted = Object.entries(burgerSales)
                    .map(([name, sales]) => ({ name, sales }))
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5);
                setTopBurgers(sorted);

                // ---- Sample daily sales (replace with real API later) ----
                setDailySales([
                    { date: 'May 10', sales: 1250 },
                    { date: 'May 11', sales: 2100 },
                    { date: 'May 12', sales: 1800 },
                    { date: 'May 13', sales: 2450 },
                ]);

                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) return <div className="analytics-loading">Loading analytics...</div>;

    // ---- Pie Chart Data (Order Status) ----
    const statusCounts = { Pending: 0, Delivered: 0, Cancelled: 0 };
    data.recentOrders?.forEach(order => {
        if (order.status === 'Pending') statusCounts.Pending++;
        else if (order.status === 'Delivered') statusCounts.Delivered++;
        else if (order.status === 'Cancelled') statusCounts.Cancelled++;
    });
    const pieData = [
        { name: 'Pending', value: statusCounts.Pending, color: '#ff9800' },
        { name: 'Delivered', value: statusCounts.Delivered, color: '#4caf50' },
        { name: 'Cancelled', value: statusCounts.Cancelled, color: '#f44336' }
    ].filter(item => item.value > 0);

    return (
        <div className="analytics-page">
            <h1>📊 Sales Analytics</h1>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">Total Orders: <strong>{data.totalOrders}</strong></div>
                <div className="stat-card">Revenue: <strong>{data.totalRevenue.toLocaleString()} ETB</strong></div>
                <div className="stat-card">Pending Orders: <strong>{data.pendingOrders}</strong></div>
                <div className="stat-card">Top Burger: <strong>{data.topBurger}</strong></div>
            </div>

            {/* Bar Chart – Top Selling Burgers */}
            {topBurgers.length > 0 && (
                <div className="chart-container">
                    <h3>🍔 Top Selling Burgers (Units Sold)</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={topBurgers} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#00897b" name="Units Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="chart-note">🎨 Color: <span style={{ color: '#00897b' }}>Teal (#00897b)</span> – burger popularity.</p>
                </div>
            )}

            {/* Line Chart – Daily Sales Trend */}
            <div className="chart-container">
                <h3>📈 Daily Sales Trend (Last 7 days – sample data)</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#ff6d00" name="Revenue (ETB)" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
                <p className="chart-note">🎨 Color: <span style={{ color: '#ff6d00' }}>Orange (#ff6d00)</span> – sales amount over time.</p>
            </div>

            {/* Pie Chart – Order Status Distribution */}
            {pieData.length > 0 && (
                <div className="chart-container">
                    <h3>📦 Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="chart-note">
                        🎨 Colors: <span style={{ color: '#ff9800' }}>Orange (#ff9800)</span> = Pending,{' '}
                        <span style={{ color: '#4caf50' }}>Green (#4caf50)</span> = Delivered,{' '}
                        <span style={{ color: '#f44336' }}>Red (#f44336)</span> = Cancelled.
                    </p>
                </div>
            )}

            {/* Recent Orders with Numbers */}
            <div className="recent-orders">
                <h3>📋 Recent Orders</h3>
                <ul>
                    {data.recentOrders.map((order, index) => (
                        <li key={order._id}>
                            <strong>{index + 1}.</strong> {order.fullName} – {order.totalPrice} ETB – <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Analytics;