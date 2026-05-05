import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {

    // AUTH
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // DATA
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);

    // FORM
    const [newBurger, setNewBurger] = useState({
        name: '',
        price: '',
        image: '',
        category: 'Beef',
        description: ''
    });

    // FETCH
    const fetchBurgers = useCallback(async () => {
        const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
        setBurgers(res.data);
    }, []);

    const fetchOrders = useCallback(async () => {
        const res = await axios.get(
            'https://beebboo-backend.onrender.com/api/orders',
            { headers: { 'admin-secret': 'admin123' } }
        );
        setOrders(res.data);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchBurgers();
            fetchOrders();
        }
    }, [isAuthenticated, fetchBurgers, fetchOrders]);

    // LOGIN
    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        setTimeout(() => {
            if (password === "admin123") {
                setIsAuthenticated(true);
            } else {
                setError("Wrong password");
            }
            setLoading(false);
        }, 800);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
    };

    // CRUD
    const handleAddBurger = async (e) => {
        e.preventDefault();

        await axios.post(
            'https://beebboo-backend.onrender.com/api/menu',
            { ...newBurger, countInStock: 20 },
            { headers: { 'admin-secret': 'admin123' } }
        );

        setNewBurger({
            name: '',
            price: '',
            image: '',
            category: 'Beef',
            description: ''
        });

        fetchBurgers();
    };

    const deleteBurger = async (id) => {
        await axios.delete(
            `https://beebboo-backend.onrender.com/api/menu/${id}`,
            { headers: { 'admin-secret': 'admin123' } }
        );
        fetchBurgers();
    };

    const updateOrderStatus = async (id, status) => {
        await axios.put(
            `https://beebboo-backend.onrender.com/api/orders/${id}`,
            { status },
            { headers: { 'admin-secret': 'admin123' } }
        );
        fetchOrders();
    };

    // LOGIN UI
    if (!isAuthenticated) {
        return (
            <div className="login-overlay">
                <form className="login-card" onSubmit={handleLogin}>
                    <h2>Beebboo Admin Panel</h2>

                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span onClick={() => setShowPassword(!showPassword)}>👁</span>
                    </div>

                    {error && <p className="error-text">{error}</p>}

                    <button type="submit">
                        {loading ? <span className="loader"></span> : "Login"}
                    </button>
                </form>
            </div>
        );
    }

    // DASHBOARD
    return (
        <div className="admin-container">

            {/* HEADER */}
            <div className="admin-header">
                <h2>Beebboo Admin Panel</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* FORM */}
            <form className="form-card" onSubmit={handleAddBurger}>
                <h3>Add Burger</h3>

                <input
                    placeholder="Name"
                    value={newBurger.name}
                    onChange={(e) =>
                        setNewBurger({ ...newBurger, name: e.target.value })
                    }
                />

                <input
                    placeholder="Price"
                    value={newBurger.price}
                    onChange={(e) =>
                        setNewBurger({ ...newBurger, price: e.target.value })
                    }
                />

                <input
                    placeholder="Image URL"
                    value={newBurger.image}
                    onChange={(e) =>
                        setNewBurger({ ...newBurger, image: e.target.value })
                    }
                />

                {/* DESCRIPTION FIELD */}
                <textarea
                    placeholder="Burger description..."
                    value={newBurger.description}
                    onChange={(e) =>
                        setNewBurger({ ...newBurger, description: e.target.value })
                    }
                />

                <button>Add Burger</button>
            </form>

            {/* BURGERS */}
            <div>
                <h3>Burgers</h3>
                <div className="burger-list">
                    {burgers.map((b) => (
                        <div key={b._id} className="burger-card">
                            <h4>{b.name}</h4>
                            <p className="price">${b.price}</p>
                            <p className="desc">{b.description}</p>

                            <button onClick={() => deleteBurger(b._id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ORDERS */}
            <div>
                <h3>Orders</h3>
                <div className="orders">
                    {orders.map((o) => (
                        <div key={o._id} className="order-card">
                            <div>
                                <strong>{o.fullName}</strong>
                                <p>{o.status}</p>
                            </div>

                            <select
                                onChange={(e) =>
                                    updateOrderStatus(o._id, e.target.value)
                                }
                            >
                                <option>Pending</option>
                                <option>Delivered</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;