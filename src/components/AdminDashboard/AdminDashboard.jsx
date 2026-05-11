import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {

    const [burgers, setBurgers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newBurger, setNewBurger] = useState({
        name: '',
        price: '',
        image: null,
        category: 'Beef',
        description: ''
    });

    const [editingBurger, setEditingBurger] = useState(null);

    const [editForm, setEditForm] = useState({
        name: '',
        price: '',
        category: 'Beef',
        description: '',
        image: null
    });

    const fetchBurgers = useCallback(async () => {
        try {
            const res = await axios.get('https://beebboo-backend.onrender.com/api/menu');

            console.log("🍔 BURGERS:", res.data);

            setBurgers(res.data);
        } catch (error) {
            console.error('Error fetching burgers:', error);
        }
    }, []);

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

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        window.location.href = '/login';
    };

    // ADD BURGER
    const handleAddBurger = async (e) => {
        e.preventDefault();

        if (!newBurger.name || !newBurger.price) {
            alert('Please fill all fields');
            return;
        }

        let imageUrl = '';

        if (newBurger.image) {

            const cloudinaryFormData = new FormData();

            cloudinaryFormData.append('file', newBurger.image);

            cloudinaryFormData.append(
                'upload_preset',
                'beebboo_uploads'
            );

            cloudinaryFormData.append(
                'folder',
                'beebboo-burgers'
            );

            try {

                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload',
                    {
                        method: 'POST',
                        body: cloudinaryFormData
                    }
                );

                const data = await response.json();

                console.log("☁️ CLOUDINARY RESPONSE:", data);

                imageUrl = data.secure_url;

                if (!imageUrl) {
                    alert('Cloudinary image upload failed');
                    return;
                }

            } catch (error) {
                console.error(error);
                alert('Cloudinary upload error');
                return;
            }
        }

        const burgerData = {
            name: newBurger.name,
            price: parseFloat(newBurger.price),
            category: newBurger.category,
            description: newBurger.description,
            image: imageUrl,
            countInStock: 20
        };

        console.log("📦 BURGER DATA:", burgerData);

        try {

            await axios.post(
                'https://beebboo-backend.onrender.com/api/menu',
                burgerData,
                {
                    headers: {
                        'admin-secret': 'admin123',
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Burger added successfully 🍔');

            setNewBurger({
                name: '',
                price: '',
                image: null,
                category: 'Beef',
                description: ''
            });

            fetchBurgers();

        } catch (error) {
            console.error(error);
            alert('Failed to add burger');
        }
    };

    // EDIT
    const handleEditBurger = (burger) => {

        setEditingBurger(burger);

        setEditForm({
            name: burger.name,
            price: burger.price,
            category: burger.category || 'Beef',
            description: burger.description || '',
            image: null
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // UPDATE
    const handleUpdateBurger = async (e) => {

        e.preventDefault();

        let imageUrl = editingBurger?.image;

        if (editForm.image) {

            const cloudinaryFormData = new FormData();

            cloudinaryFormData.append('file', editForm.image);

            cloudinaryFormData.append(
                'upload_preset',
                'beebboo_uploads'
            );

            cloudinaryFormData.append(
                'folder',
                'beebboo-burgers'
            );

            try {

                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload',
                    {
                        method: 'POST',
                        body: cloudinaryFormData
                    }
                );

                const data = await response.json();

                imageUrl = data.secure_url;

            } catch (error) {
                alert('Image upload failed');
                return;
            }
        }

        const burgerData = {
            name: editForm.name,
            price: parseFloat(editForm.price),
            category: editForm.category,
            description: editForm.description,
            image: imageUrl
        };

        try {

            await axios.put(
                `https://beebboo-backend.onrender.com/api/menu/${editingBurger._id}`,
                burgerData,
                {
                    headers: {
                        'admin-secret': 'admin123',
                        'Content-Type': 'application/json'
                    }
                }
            );

            alert('Burger updated successfully');

            setEditingBurger(null);

            fetchBurgers();

        } catch (error) {
            console.error(error);
            alert('Update failed');
        }
    };

    const cancelEdit = () => {
        setEditingBurger(null);

        setEditForm({
            name: '',
            price: '',
            category: 'Beef',
            description: '',
            image: null
        });
    };

    const deleteBurger = async (id) => {

        if (!window.confirm('Delete burger?')) return;

        try {

            await axios.delete(
                `https://beebboo-backend.onrender.com/api/menu/${id}`,
                {
                    headers: {
                        'admin-secret': 'admin123'
                    }
                }
            );

            fetchBurgers();

        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-container">

            <div className="admin-header">
                <h2>🍔 Beebboo Admin Panel</h2>

                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>

            <form
                className="form-card"
                onSubmit={editingBurger ? handleUpdateBurger : handleAddBurger}
            >

                <h3>
                    {editingBurger ? 'Edit Burger' : 'Add Burger'}
                </h3>

                <input
                    type="text"
                    placeholder="Burger Name"
                    value={editingBurger ? editForm.name : newBurger.name}
                    onChange={(e) =>
                        editingBurger
                            ? setEditForm({
                                ...editForm,
                                name: e.target.value
                            })
                            : setNewBurger({
                                ...newBurger,
                                name: e.target.value
                            })
                    }
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={editingBurger ? editForm.price : newBurger.price}
                    onChange={(e) =>
                        editingBurger
                            ? setEditForm({
                                ...editForm,
                                price: e.target.value
                            })
                            : setNewBurger({
                                ...newBurger,
                                price: e.target.value
                            })
                    }
                />

                <textarea
                    placeholder="Description"
                    value={editingBurger ? editForm.description : newBurger.description}
                    onChange={(e) =>
                        editingBurger
                            ? setEditForm({
                                ...editForm,
                                description: e.target.value
                            })
                            : setNewBurger({
                                ...newBurger,
                                description: e.target.value
                            })
                    }
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                        editingBurger
                            ? setEditForm({
                                ...editForm,
                                image: e.target.files[0]
                            })
                            : setNewBurger({
                                ...newBurger,
                                image: e.target.files[0]
                            })
                    }
                />

                <button type="submit">
                    {editingBurger ? 'Update Burger' : 'Add Burger'}
                </button>

            </form>

            <div className="burger-list">

                {burgers.map((b) => (

                    <div className="burger-card" key={b._id}>

                        {b.image && (
                            <img
                                src={b.image}
                                alt={b.name}
                                style={{
                                    width: '100%',
                                    height: '220px',
                                    objectFit: 'cover'
                                }}
                            />
                        )}

                        <h3>{b.name}</h3>

                        <p>{b.price} ETB</p>

                        <p>{b.description}</p>

                        <button onClick={() => handleEditBurger(b)}>
                            Edit
                        </button>

                        <button onClick={() => deleteBurger(b._id)}>
                            Delete
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
};

export default AdminDashboard;