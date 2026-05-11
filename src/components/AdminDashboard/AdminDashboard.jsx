import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {

    // DATA
    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // FORM
    const [newBurger, setNewBurger] = useState({
        name: '',
        price: '',
        image: null,
        category: 'Beef',
        description: ''
    });

    // Get token from localStorage
    const getToken = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        return userInfo?.token;
    };

    // FETCH BURGERS
    const fetchBurgers = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');
            setBurgers(res.data);
        } catch (error) {
            console.error('Error fetching burgers:', error);
        }
    }, []);

    // FETCH ORDERS
    const fetchOrders = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, []);

    useEffect(() => {
        fetchBurgers();
        fetchOrders();
        setLoading(false);
    }, [fetchBurgers, fetchOrders]);

    // LOGOUT
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    // ADD BURGER
    const handleAddBurger = async (e) => {
        e.preventDefault();
        const token = getToken();

        if (!token) {
            alert('Please login again');
            return;
        }

        const formData = new FormData();
        formData.append('name', newBurger.name);
        formData.append('price', newBurger.price);
        formData.append('category', newBurger.category);
        formData.append('description', newBurger.description);
        if (newBurger.image) formData.append('image', newBurger.image);

        try {
            await axios.post('https://beebboo-backend.onrender.com/api/menu', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setNewBurger({
                name: '',
                price: '',
                image: null,
                category: 'Beef',
                description: ''
            });

            fetchBurgers();
            alert('Burger added successfully! 🍔');
        } catch (error) {
            console.error('Error adding burger:', error);
            alert('Failed to add burger');
        }
    };

    // DELETE BURGER
    const deleteBurger = async (id) => {
        if (!window.confirm('Delete this burger?')) return;

        const token = getToken();
        try {
            await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchBurgers();
            alert('Burger deleted! 🗑️');
        } catch (error) {
            console.error('Error deleting burger:', error);
            alert('Failed to delete burger');
        }
    };

    // UPDATE ORDER STATUS
    const updateOrderStatus = async (id, status) => {
        const token = getToken();
        try {
            await axios.put(
                `https://beebboo-backend.onrender.com/api/orders/${id}`,
                { status },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            fetchOrders();
            alert('Order status updated!');
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;

    // DASHBOARD
    return (
        <div className="admin-container">

            {/* HEADER */}
            <div className="admin-header">
                <h2>🍔 Beebboo Admin Panel</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            {/* ADD BURGER FORM */}
            <form className="form-card" onSubmit={handleAddBurger}>
                <h3>Add New Burger</h3>

                <input
                    type="text"
                    placeholder="Burger Name"
                    value={newBurger.name}
                    onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                    required
                />

                <input
                    type="number"
                    placeholder="Price (ETB)"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    required
                />

                <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                >
                    <option>Beef</option>
                    <option>Chicken</option>
                    <option>Vegan</option>
                    <option>Special</option>
                </select>

                <textarea
                    placeholder="Burger description..."
                    rows="3"
                    value={newBurger.description}
                    onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewBurger({ ...newBurger, image: e.target.files[0] })}
                />

                <button type="submit">Add Burger</button>
            </form>

            {/* BURGERS LIST */}
            <div>
                <h3>Burgers ({burgers.length})</h3>
                <div className="burger-list">
                    {burgers.map((b) => (
                        <div key={b._id} className="burger-card">
                            {b.image && <img src={b.image} alt={b.name} />}
                            <h4>{b.name}</h4>
                            <p className="price">{b.price} ETB</p>
                            <p className="desc">{b.description}</p>
                            <button onClick={() => deleteBurger(b._id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ORDERS LIST */}
            <div>
                <h3>Orders ({orders.length})</h3>
                <div className="orders">
                    {orders.map((o) => (
                        <div key={o._id} className="order-card">
                            <div>
                                <strong>{o.fullName}</strong>
                                <p>Status: {o.status}</p>
                                <p>Total: {o.totalPrice} ETB</p>
                            </div>
                            {o.screenshot && (
                                <a href={o.screenshot} target="_blank" rel="noopener noreferrer">
                                    View Screenshot
                                </a>
                            )}
                            <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                            >
                                <option>Pending</option>
                                <option>Processing</option>
                                <option>Delivered</option>
                                <option>Cancelled</option>
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;