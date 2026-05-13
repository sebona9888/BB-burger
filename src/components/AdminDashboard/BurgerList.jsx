// src/components/AdminDashboard/BurgerList.jsx
import React from 'react';

const BurgerList = ({ burgers, onEdit, onDelete }) => {
    return (
        <div className="burger-list">
            {burgers.map(b => (
                <div key={b._id} className="burger-card">
                    {b.image && <img src={b.image} alt={b.name} />}
                    <div className="card-content">
                        <h3>{b.name}</h3>
                        <p className="price">{b.price} ETB</p>
                        <div className="card-actions">
                            <button className="edit-btn" onClick={() => onEdit(b)}>Edit</button>
                            <button className="delete-btn" onClick={() => onDelete(b._id)}>Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BurgerList;