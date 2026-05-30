// src/components/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import BurgerForm from './BurgerForm';
import BurgerList from './BurgerList';
import OrdersSection from './OrdersSection';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchName, setSearchName] = useState('');
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
            setFilteredOrders(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch orders');
        }
    };

    useEffect(() => {
        fetchBurgers();
        fetchOrders();
    }, []);

    useEffect(() => {
        if (searchName === '') {
            setFilteredOrders(orders);
        } else {
            const filtered = orders.filter(order =>
                order.fullName?.toLowerCase().includes(searchName.toLowerCase())
            );
            setFilteredOrders(filtered);
        }
    }, [searchName, orders]);

    const uploadToCloudinary = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'prime_uploads');
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
                toast.success('Burger updated! 🍔', { id: loadingToast });
            } else {
                await axios.post('https://beebboo-backend.onrender.com/api/menu', burgerData, {
                    headers: { 'admin-secret': 'admin123' }
                });
                toast.success('Burger added! 🍔', { id: loadingToast });
            }
            setForm({ name: '', price: '', category: 'Beef', description: '', image: null });
            setEditing(null);
            fetchBurgers();
        } catch (error) {
            toast.error('Operation failed', { id: loadingToast });
        }
    };

    const deleteBurger = async (id) => {
        if (!confirm('Delete this burger?')) return;
        try {
            await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, {
                headers: { 'admin-secret': 'admin123' }
            });
            toast.success('Burger deleted!');
            fetchBurgers();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`https://beebboo-backend.onrender.com/api/orders/${id}`, { status }, {
                headers: { 'admin-secret': 'admin123' }
            });
            toast.success(`Order status: ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error('Status update failed');
        }
    };

    if (loading) return <div className="loading-screen">Loading beebboo Admin...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>🍔 beebboo Admin</h2>
                <button className="logout-btn" onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/login'; }}>Logout</button>
            </div>

            <BurgerForm
                editing={editing}
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                onCancel={() => { setEditing(null); setForm({ name: '', price: '', category: 'Beef', description: '', image: null }); }}
            />

            <BurgerList
                burgers={burgers}
                onEdit={(burger) => {
                    setEditing(burger);
                    setForm({
                        name: burger.name,
                        price: burger.price,
                        category: burger.category || 'Beef',
                        description: burger.description || '',
                        image: null
                    });
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onDelete={deleteBurger}
            />

            <OrdersSection
                orders={orders}
                filteredOrders={filteredOrders}
                searchName={searchName}
                setSearchName={setSearchName}
                onStatusChange={updateOrderStatus}
            />
        </div>
    );
};

export default AdminDashboard;