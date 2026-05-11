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
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/orders', {
                headers: { 'admin-secret': 'admin123' }
            });
            setOrders(res.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
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

    // ✅ FIXED: ADD BURGER - Direct Cloudinary Upload (No Backend Image Processing)
    const handleAddBurger = async (e) => {
        e.preventDefault();

        if (!newBurger.name || !newBurger.price) {
            alert('Please fill in burger name and price');
            return;
        }

        let imageUrl = null;

        // Step 1: Upload image directly to Cloudinary (unsigned)
        if (newBurger.image) {
            const cloudinaryFormData = new FormData();
            cloudinaryFormData.append('file', newBurger.image);
            cloudinaryFormData.append('upload_preset', 'beebboo_unsigned');
            cloudinaryFormData.append('folder', 'beebboo-burgers');

            try {
                const response = await fetch('https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload', {
                    method: 'POST',
                    body: cloudinaryFormData
                });
                const data = await response.json();
                imageUrl = data.secure_url;
                console.log('✅ Image uploaded to Cloudinary:', imageUrl);
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                alert('Failed to upload image. Please try again.');
                return;
            }
        }

        // Step 2: Send burger data as JSON to backend
        const burgerData = {
            name: newBurger.name,
            price: parseFloat(newBurger.price),
            category: newBurger.category,
            description: newBurger.description,
            image: imageUrl,
            countInStock: 20
        };

        try {
            await axios.post('https://beebboo-backend.onrender.com/api/menu', burgerData, {
                headers: {
                    'admin-secret': 'admin123',
                    'Content-Type': 'application/json'
                }
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
            console.error('Error adding burger:', error.response?.data || error.message);
            alert('Failed to add burger. Please try again.');
        }
    };

    // DELETE BURGER
    const deleteBurger = async (id) => {
        if (!window.confirm('Delete this burger?')) return;

        try {
            await axios.delete(`https://beebboo-backend.onrender.com/api/menu/${id}`, {
                headers: { 'admin-secret': 'admin123' }
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
        try {
            await axios.put(
                `https://beebboo-backend.onrender.com/api/orders/${id}`,
                { status },
                { headers: { 'admin-secret': 'admin123' } }
            );
            fetchOrders();
            alert('Order status updated!');
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order');
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
                    {burgers.length === 0 ? (
                        <p>No burgers yet. Add your first burger above!</p>
                    ) : (
                        burgers.map((b) => (
                            <div key={b._id} className="burger-card">
                                {b.image && <img src={b.image} alt={b.name} />}
                                <h4>{b.name}</h4>
                                <p className="price">{b.price} ETB</p>
                                <p className="desc">{b.description}</p>
                                <button onClick={() => deleteBurger(b._id)}>Delete</button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ORDERS LIST */}
            <div>
                <h3>Orders ({orders.length})</h3>
                <div className="orders">
                    {orders.length === 0 ? (
                        <p>No orders yet.</p>
                    ) : (
                        orders.map((o) => (
                            <div key={o._id} className="order-card">
                                <div>
                                    <strong>{o.fullName}</strong>
                                    <p>Status: {o.status}</p>
                                    <p>Total: {o.totalPrice} ETB</p>
                                    <p>Phone: {o.phone}</p>
                                    <p>Address: {o.address}</p>
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;