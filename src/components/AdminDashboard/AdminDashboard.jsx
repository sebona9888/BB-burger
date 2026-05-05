import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {

    // --- AUTH ---
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // --- DATA ---
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);

    // --- EDIT ---
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [newBurger, setNewBurger] = useState({
        name: '',
        price: '',
        image: '',
        category: 'Beef',
        description: ''
    });

    // --- FETCH ---
    const fetchBurgers = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
            setBurgers(res.data);
        } catch (error) {
            console.error(error);
        }
    }, []);
    

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/orders', {
                headers: { 'admin-secret': 'admin123' }
            });
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const loadData = async () => {
                setLoading(true);
                try {
                    await fetchBurgers();
                    await fetchOrders();
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }
    }, [isAuthenticated, fetchBurgers, fetchOrders]);

    // --- LOGIN ---
    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        setTimeout(() => {
            if (password === "admin123") {
                setIsAuthenticated(true);
            } else {
                setError("Password dogoggora!");
            }
            setLoading(false);
        }, 800);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
    };

    // --- CRUD ---
    const deleteBurger = async (id) => {
        if (window.confirm("Delete this burger?")) {
            await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, {
                headers: { 'admin-secret': 'admin123' }
            });
            fetchBurgers();
        }
    };

    const startEdit = (burger) => {
        setIsEditing(true);
        setEditId(burger._id);
        setNewBurger(burger);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditId(null);
        setNewBurger({ name: '', price: '', image: '', category: 'Beef', description: '' });
    };

    const handleAddBurger = async (e) => {
        e.preventDefault();

        if (isEditing) {
            await axios.put(`https://beebboo-backend.onrender.com/api/menu/${editId}`, newBurger, {
                headers: { 'admin-secret': 'admin123' }
            });
        } else {
            await axios.post(`https://beebboo-backend.onrender.com/api/menu`, {
                ...newBurger,
                countInStock: 20
            }, {
                headers: { 'admin-secret': 'admin123' }
            });
        }

        cancelEdit();
        fetchBurgers();
    };

    const updateOrderStatus = async (id, status) => {
        await axios.put(`https://beebboo-backend.onrender.com/api/orders/${id}`,
            { status },
            { headers: { 'admin-secret': 'admin123' } });
        fetchOrders();
    };

    const deleteOrder = async (id) => {
        if (window.confirm("Delete order?")) {
            await axios.delete(`https://beebboo-backend.onrender.com/api/orders/${id}`, {
                headers: { 'admin-secret': 'admin123' }
            });
            fetchOrders();
        }
    };

    // --- LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="login-overlay">
                <form className="login-card" onSubmit={handleLogin}>
                    <h2>Beebboo Admin Login</h2>

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "🙈" : "👁"}
                        </span>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Login"}
                    </button>
                </form>
            </div>
        );
    }

    // --- MAIN UI ---
    return (
        <div className="admin-container">

            <div className="admin-header-flex">
                <h2>Beebboo Admin Panel</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <form className="add-burger-form" onSubmit={handleAddBurger}>
                <h3>{isEditing ? "Edit Burger" : "Add Burger"}</h3>

                <input placeholder="Name"
                    value={newBurger.name}
                    onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                />

                <input placeholder="Price"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                />

                <input placeholder="Image URL"
                    value={newBurger.image}
                    onChange={(e) => setNewBurger({ ...newBurger, image: e.target.value })}
                />

                <button>{isEditing ? "Update" : "Add +"}</button>
            </form>

            <h3>Burgers</h3>
            <div className="burger-list">
                {burgers.map(b => (
                    <div key={b._id} className="burger-item">
                        {b.name} - {b.price}
                        <button onClick={() => startEdit(b)}>Edit</button>
                        <button onClick={() => deleteBurger(b._id)}>Delete</button>
                    </div>
                ))}
            </div>

            <h3>Orders</h3>
            {orders.map(o => (
                <div key={o._id} className="order-item">
                    {o.fullName} - {o.status}
                    <select onChange={(e) => updateOrderStatus(o._id, e.target.value)}>
                        <option>Pending</option>
                        <option>Delivered</option>
                    </select>
                    <button onClick={() => deleteOrder(o._id)}>Delete</button>
                </div>
            ))}

        </div>
    );
};

export default AdminDashboard;