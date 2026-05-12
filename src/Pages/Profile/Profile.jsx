import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem('userInfo');
        if (!stored) {
            navigate('/login');
            return;
        }
        const user = JSON.parse(stored);
        setUserInfo(user);
        setFormData({
            name: user.user?.name || user.name || '',
            email: user.user?.email || user.email || '',
            phone: user.user?.phone || user.phone || '',
            address: user.user?.address || user.address || ''
        });
    }, [navigate]);

    const handleSave = () => {
        const updated = { ...userInfo, user: { ...userInfo.user, ...formData } };
        localStorage.setItem('userInfo', JSON.stringify(updated));
        setUserInfo(updated);
        setIsEditing(false);
        toast.success('Profile updated!', { position: 'top-center' });
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>👤 My Profile</h2>

                {!isEditing ? (
                    <>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone || 'Not set'}</p>
                        <p><strong>Address:</strong> {formData.address || 'Not set'}</p>
                        <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
                        <button onClick={() => navigate('/my-orders')}>📋 My Orders</button>
                        <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>🚪 Logout</button>
                    </>
                ) : (
                    <>
                        <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Name" />
                        <input value={formData.email} disabled placeholder="Email (cannot change)" />
                        <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone" />
                        <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Address" rows="2" />
                        <button onClick={handleSave}>💾 Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;