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
    const [range, setRange] = useState('month'); // day, week, month

    useEffect(() => {
        fetchAnalytics();
    }, [range]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`https://prime-backend.onrender.com/api/analytics?range=${range}`, {
                headers: { 'admin-secret': 'admin123' }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="analytics-loading">Loading analytics...</div>;

    // Prepare data for charts
    const topBurgers = data.topBurgers?.map(item => ({ name: item._id, sales: item.totalSold })) || [];
    const salesTrend = data.salesTrend?.map(item => ({
        period: item._id,
        sales: item.totalSales,
        orders: item.orderCount
    })) || [];

    // Order status pie chart
    const statusColors = { Pending: '#ff9800', Processing: '#2196f3', Delivered: '#4caf50', Cancelled: '#f44336' };
    const pieData = data.statusDist?.map(s => ({ name: s._id, value: s.count, color: statusColors[s._id] || '#888' })) || [];

    return (
        <div className="analytics-page">
            <h1>📊 Sales Analytics</h1>

            {/* Range Selector */}
            <div className="range-selector">
                <button className={range === 'day' ? 'active' : ''} onClick={() => setRange('day')}>Last 30 Days</button>
                <button className={range === 'week' ? 'active' : ''} onClick={() => setRange('week')}>Last 6 Months (Weekly)</button>
                <button className={range === 'month' ? 'active' : ''} onClick={() => setRange('month')}>Last 12 Months (Monthly)</button>
            </div>

            {/* KPI Cards */}
            <div className="stats-grid">
                <div className="stat-card">Total Orders: <strong>{data.totalOrders}</strong></div>
                <div className="stat-card">Revenue: <strong>{data.totalRevenue.toLocaleString()} ETB</strong></div>
                <div className="stat-card">Pending Orders: <strong>{data.pendingOrders}</strong></div>
                <div className="stat-card">Top Burger: <strong>{data.topBurgers?.[0]?._id || 'N/A'}</strong></div>
            </div>

            {/* Bar Chart – Top Selling Burgers */}
            {topBurgers.length > 0 && (
                <div className="chart-container">
                    <h3>🍔 Top Selling Burgers (All Time)</h3>
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
                </div>
            )}

            {/* Line Chart – Sales Trend */}
            {salesTrend.length > 0 && (
                <div className="chart-container">
                    <h3>📈 Sales Trend ({range === 'day' ? 'Daily' : range === 'week' ? 'Weekly' : 'Monthly'})</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={salesTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="period" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#ff6d00" name="Revenue (ETB)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Pie Chart – Order Status */}
            {pieData.length > 0 && (
                <div className="chart-container">
                    <h3>📦 Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {pieData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="chart-note">
                        🎨 Colors: <span style={{color:'#ff9800'}}>Orange</span> = Pending,{' '}
                        <span style={{color:'#4caf50'}}>Green</span> = Delivered,{' '}
                        <span style={{color:'#f44336'}}>Red</span> = Cancelled.
                    </p>
                </div>
            )}

            {/* Recent Orders with Numbers */}
            <div className="recent-orders">
                <h3>📋 Recent Orders</h3>
                <ul>
                    {data.recentOrders?.map((order, idx) => (
                        <li key={order._id}>
                            <strong>{idx + 1}.</strong> {order.fullName} – {order.totalPrice} ETB – <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Analytics;