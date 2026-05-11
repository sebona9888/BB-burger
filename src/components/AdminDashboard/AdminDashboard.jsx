import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [burgers, setBurgers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', category: 'Beef', description: '', image: null });

    const fetchBurgers = async () => {
        const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
        setBurgers(res.data);
        setLoading(false);
    };

    useEffect(() => { fetchBurgers(); }, []);

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
        let imageUrl = '';
        if (form.image) imageUrl = await uploadToCloudinary(form.image);
        const burgerData = { ...form, price: parseFloat(form.price), image: imageUrl };
        if (editing) {
            await axios.put(`https://beebboo-backend.onrender.com/api/menu/${editing._id}`, burgerData, { headers: { 'admin-secret': 'admin123' } });
        } else {
            await axios.post('https://beebboo-backend.onrender.com/api/menu', burgerData, { headers: { 'admin-secret': 'admin123' } });
        }
        setForm({ name: '', price: '', category: 'Beef', description: '', image: null });
        setEditing(null);
        fetchBurgers();
        alert(editing ? 'Updated!' : 'Added!');
    };

    const deleteBurger = async (id) => {
        if (!confirm('Delete?')) return;
        await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, { headers: { 'admin-secret': 'admin123' } });
        fetchBurgers();
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>🍔 Beebboo Admin</h2>
                <button onClick={() => { localStorage.removeItem('userInfo'); window.location.href = '/login'; }}>Logout</button>
            </div>

            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                <input type="number" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Beef</option><option>Chicken</option><option>Vegan</option><option>Special</option>
                </select>
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
                <button type="submit">{editing ? 'Update' : 'Add'} Burger</button>
                {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', category: 'Beef', description: '', image: null }); }}>Cancel</button>}
            </form>

            <div className="burger-list">
                {burgers.map(b => (
                    <div key={b._id} className="burger-card">
                        {b.image && <img src={b.image} alt={b.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                        <h3>{b.name}</h3>
                        <p>{b.price} ETB</p>
                        <p>{b.description}</p>
                        <button onClick={() => { setEditing(b); setForm({ name: b.name, price: b.price, category: b.category || 'Beef', description: b.description || '', image: null }); window.scrollTo({ top: 0 }); }}>Edit</button>
                        <button onClick={() => deleteBurger(b._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;