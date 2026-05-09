import React, { useState } from 'react';
import axios from 'axios';
import './AddBurger.css';

const AddBurger = () => {
    const [burger, setBurger] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Beef',
        image: '',
        countInStock: ''
    });

    const handleChange = (e) => {
        setBurger({ ...burger, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // URL Backend (5000) fi Headers 'admin_secret' dabalameera
            await axios.post('https://beebboo-backend.onrender.com/menu/menu', burger, {
                headers: {
                    'admin_secret': 'admin123' // Kun eeyyama Admin mirkaneessa
                }
            });

            alert("Burger haaraan milkiidhaan dabalameera!");

            // Form-icha qulqulleessuuf
            setBurger({
                name: '',
                price: '',
                description: '',
                category: 'Beef',
                image: '',
                countInStock: ''
            });
        } catch (err) {
            console.error("Dogoggora:", err);
            // Yoo backend eeyyama dhowwate (403) ykn hin kaane ta'e
            alert("Erguun hin danda'amne! Backend kee ka'uu fi 'admin_secret' sirrii ta'uu mirkaneessi.");
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-card">
                <h2>Admin Dashboard</h2>
                <p>Beebboo Burger Galchi</p>
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="input-group">
                        <label>Maqaa Burger</label>
                        <input type="text" name="name" value={burger.name} placeholder="Maqaa" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Gatii (ETB)</label>
                        <input type="number" name="price" value={burger.price} placeholder="Gatii" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Ibsa (Description)</label>
                        <textarea name="description" value={burger.description} placeholder="Ibsa" onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Gosa (Category)</label>
                        <select name="category" value={burger.category} onChange={handleChange}>
                            <option value="Beef">Beef</option>
                            <option value="Chicken">Chicken</option>
                            <option value="Veggie">Veggie</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>URL Suuraa</label>
                        <input type="text" name="image" value={burger.image} placeholder="https://..." onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label>Hammamtu Jira (Stock)</label>
                        <input type="number" name="countInStock" value={burger.countInStock} placeholder="Stock" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="save-btn">Save Burger</button>
                </form>
            </div>
        </div>
    );
};

export default AddBurger;