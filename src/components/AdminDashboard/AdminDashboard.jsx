import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // ✅ Dabalata
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', category: 'Beef', description: '', image: null });

    const fetchBurgers = async () => {
        const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
        setBurgers(res.data);
        setLoading(false);
    };

    const fetchOrders = async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/orders', {
                headers: { 'admin-secret': 'admin123' }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Orders fiduun hin danda\'amne');
        }
    };

    useEffect(() => {
        fetchBurgers();
        fetchOrders();
    }, []);

    const uploadToCloudinary = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'beebboo_uploads');
        fd.append('folder', 'beebboo-burgers');
        const res = await fetch('https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload', { method: 'POST', body: fd });
        const data = await res.json();
        return data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editing ? 'Updating burger...' : 'Adding burger...');

        try {
            let imageUrl = editing?.image || '';
            if (form.image) imageUrl = await uploadToCloudinary(form.image);

            const burgerData = { ...form, price: parseFloat(form.price), image: imageUrl };

            if (editing) {
                await axios.put(`https://beebboo-backend.onrender.com/api/menu/${editing._id}`, burgerData, {
                    headers: { 'admin-secret': 'admin123' }
                });
                toast.success('Burger successfully updated! 🍔', { id: loadingToast });
            } else {
                await axios.post('https://beebboo-backend.onrender.com/api/menu', burgerData, {
                    headers: { 'admin-secret': 'admin123' }
                });
                toast.success('New burger added! 🍔', { id: loadingToast });
            }

            setForm({ name: '', price: '', category: 'Beef', description: '', image: null });
            setEditing(null);
            fetchBurgers();
        } catch (error) {
            toast.error('Hojichi hin milkoofne', { id: loadingToast });
        }
    };

    const deleteBurger = async (id) => {
        if (!confirm('Delete this burger?')) return;
        try {
            await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, {
                headers: { 'admin-secret': 'admin123' }
            });
            toast.success('Burger deleted! 🗑️');
            fetchBurgers();
        } catch (error) {
            toast.error('Haquun hin danda\'amne');
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`https://beebboo-backend.onrender.com/api/orders/${id}`, { status }, {
                headers: { 'admin-secret': 'admin123' }
            });
            toast.success(`Order status: ${status} ✅`);
            fetchOrders();
            position = "middle-center"; 
        } catch (error) {
            toast.error('Status jijjiiruun hin danda\'amne');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return '⏳ Pending';
            case 'Processing': return '🔄 Processing';
            case 'Delivered': return '✅ Delivered';
            case 'Cancelled': return '❌ Cancelled';
            default: return status;
        }
    };

    if (loading) return <div className="loading-screen">Loading Beebboo Admin...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>🍔 Beebboo Admin</h2>
                <button className="logout-btn" onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/login'; }}>Logout</button>
            </div>

            <form className="admin-form" onSubmit={handleSubmit}>
                <h3>{editing ? 'Edit Burger' : 'Add New Burger'}</h3>
                <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Beef</option><option>Chicken</option><option>Vegan</option><option>Special</option>
                </select>
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                <button type="submit" className="submit-btn">{editing ? 'Update' : 'Add'} Burger</button>
                {editing && <button type="button" className="cancel-btn" onClick={() => { setEditing(null); setForm({ name: '', price: '', category: 'Beef', description: '', image: null }); }}>Cancel</button>}
            </form>

            <div className="burger-list">
                {burgers.map(b => (
                    <div key={b._id} className="burger-card">
                        {b.image && <img src={b.image} alt={b.name} />}
                        <div className="card-content">
                            <h3>{b.name}</h3>
                            <p className="price">{b.price} ETB</p>
                            <div className="card-actions">
                                <button className="edit-btn" onClick={() => { setEditing(b); setForm({ name: b.name, price: b.price, category: b.category || 'Beef', description: b.description || '', image: null }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                                <button className="delete-btn" onClick={() => deleteBurger(b._id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="orders-section">
                <h3>📦 Orders ({orders.length})</h3>
                {orders.length === 0 ? (
                    <p>No orders yet.</p>
                ) : (
                    orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-info">
                                <strong>{order.fullName}</strong>
                                <p>📞 {order.phone} | 📍 {order.address}</p>
                                <p>💰 Total: {order.totalPrice} ETB | 💳 {order.paymentMethod}</p>
                                <p>Status: <span className={`status-${order.status.toLowerCase()}`}>{getStatusBadge(order.status)}</span></p>
                            </div>
                            {order.screenshot && (
                                <a href={order.screenshot} target="_blank" rel="noopener noreferrer" className="screenshot-link">📸 View Payment</a>
                            )}
                            <div className="order-items">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="item-row">🍔 {item.name} (x{item.quantity})</div>
                                ))}
                            </div>
                            <select
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                className="status-select"
                            >
                                <option>Pending</option>
                                <option>Processing</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;