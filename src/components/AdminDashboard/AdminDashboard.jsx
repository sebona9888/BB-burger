import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);

    const fetchBurgers = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
            setBurgers(res.data);
        } catch (error) { console.error("Error fetching burgers:", error); }
    }, []);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/orders', {
                headers: { 'admin-secret': 'admin123' }
            });
            setOrders(res.data);
        } catch (error) { console.error("Error fetching orders:", error); }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBurgers();
            fetchOrders();
        }
    }, [isAuthenticated, fetchBurgers, fetchOrders]);

    // ✅ NEW: Function to toggle Payment Verification
    const togglePaymentVerify = async (id, currentStatus) => {
        try {
            await axios.put(`https://beebboo-backend.onrender.com/api/orders/${id}`,
                { isPaymentVerified: !currentStatus },
                { headers: { 'admin-secret': 'admin123' } }
            );
            fetchOrders(); // Refresh data after update
        } catch {
            alert("Kafaltii mirkaneessuu irratti rakkoon uumame!");
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        try {
            await axios.put(`https://beebboo-backend.onrender.com/api/orders/${id}`,
                { status: newStatus },
                { headers: { 'admin-secret': 'admin123' } }
            );
            fetchOrders();
        } catch (error) { console.error("Update error:", error); }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "admin123") setIsAuthenticated(true);
        else alert("Password dogoggora!");
    };

    if (!isAuthenticated) {
        return (
            <div className="login-page">
                <div className="login-card-3d">
                    <h1 className="brand-logo">BEEBBOO</h1>
                    <p className="admin-subtitle">Management Portal</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Secret Key"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="btn-3d-gold">Enter Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <nav className="glass-nav">
                <h2 className="brand-logo">BEEBBOO ADMIN</h2>
                <button className="logout-glass" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </nav>

            <div className="dashboard-grid">
                <main className="main-content">
                    <section className="glass-card">
                        <h3>Burger Menu ({burgers.length})</h3>
                        <div className="burger-list">
                            {burgers.map(b => (
                                <div key={b._id} className="data-row-3d">
                                    <span>{b.name} - <strong>{b.price} ETB</strong></span>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                <aside className="orders-sidebar">
                    <h3>Ajajoota (Orders)</h3>
                    <div className="orders-container">
                        {orders.map(o => (
                            <div key={o._id} className="order-card-3d">
                                <div className="order-header">
                                    <strong>{o.fullName}</strong>
                                    <span className={`status-pill ${o.status}`}>{o.status}</span>
                                </div>
                                <div className="order-body">
                                    <p>📞 {o.phone}</p>
                                    <p>📍 {o.address}</p>
                                    <p className="price-tag">{o.totalPrice} ETB</p>

                                    {/* ✅ NEW: Payment Verified Checkbox */}
                                    <div className="payment-verify-area">
                                        <label className="checkbox-container">
                                            <input
                                                type="checkbox"
                                                checked={o.isPaymentVerified}
                                                onChange={() => togglePaymentVerify(o._id, o.isPaymentVerified)}
                                            />
                                            <span className="checkmark"></span>
                                            Kafaltiin Mirkanaa'eera
                                        </label>
                                    </div>
                                </div>
                                <div className="order-footer">
                                    <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
                                        <option value="Pending">Pending</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button className="btn-haqi">Haqi</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AdminDashboard;