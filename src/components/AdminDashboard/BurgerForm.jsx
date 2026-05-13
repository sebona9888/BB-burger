// src/components/AdminDashboard/BurgerForm.jsx
import React from 'react';

const BurgerForm = ({ editing, form, setForm, onSubmit, onCancel }) => {
    return (
        <form className="admin-form" onSubmit={onSubmit}>
            <h3>{editing ? 'Edit Burger' : 'Add New Burger'}</h3>
            <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
            />
            <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                required
            />
            <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
            >
                <option>Beef</option>
                <option>Chicken</option>
                <option>Vegan</option>
                <option>Special</option>
            </select>
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <input
                type="file"
                accept="image/*"
                onChange={e => setForm({ ...form, image: e.target.files[0] })}
            />
            <button type="submit" className="submit-btn">
                {editing ? 'Update' : 'Add'} Burger
            </button>
            {editing && (
                <button type="button" className="cancel-btn" onClick={onCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default BurgerForm;