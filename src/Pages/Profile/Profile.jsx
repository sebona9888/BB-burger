import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Profile.css';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [uploading, setUploading] = useState(false);
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
        setImagePreview(user.user?.profileImage || user.profileImage || '');
    }, [navigate]);

    const uploadToCloudinary = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'beebboo_uploads');
        fd.append('folder', 'profile-pictures');

        const response = await fetch('https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload', {
            method: 'POST',
            body: fd
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Upload failed');
        }

        return data.secure_url;
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image too large! Max 2MB', { position: 'top-center' });
            return;
        }

        // Preview immediately
        setImagePreview(URL.createObjectURL(file));
        setProfileImage(file);
    };

    const handleSave = async () => {
        let imageUrl = userInfo?.user?.profileImage || userInfo?.profileImage || '';

        if (profileImage) {
            setUploading(true);
            const loading = toast.loading('Uploading image...', { position: 'top-center' });

            try {
                imageUrl = await uploadToCloudinary(profileImage);
                toast.success('Image uploaded!', { id: loading, position: 'top-center' });
            } catch (error) {
                toast.error(error.message, { id: loading, position: 'top-center' });
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        const updated = {
            ...userInfo,
            user: {
                ...userInfo.user,
                ...formData,
                profileImage: imageUrl
            },
            profileImage: imageUrl
        };

        localStorage.setItem('userInfo', JSON.stringify(updated));
        setUserInfo(updated);
        setIsEditing(false);
        toast.success('Profile updated!', { position: 'top-center' });
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>👤 My Profile</h2>

                <div className="profile-image-section">
                    <img
                        src={imagePreview || 'https://via.placeholder.com/100?text=Photo'}
                        alt="Profile"
                        className="profile-avatar"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Photo'; }}
                    />
                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="image-input"
                            disabled={uploading}
                        />
                    )}
                    {uploading && <p className="upload-text">Uploading...</p>}
                </div>

                {!isEditing ? (
                    <>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Email:</strong> {formData.email}</p>
                        <p><strong>Phone:</strong> {formData.phone || 'Not set'}</p>
                        <p><strong>Address:</strong> {formData.address || 'Not set'}</p>
                        <div className="profile-buttons">
                            <button onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                            <button onClick={() => navigate('/my-orders')}>📋 My Orders</button>
                            <button onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>🚪 Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Full Name"
                        />
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            placeholder="Email (cannot change)"
                        />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="Phone Number"
                        />
                        <textarea
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Delivery Address"
                            rows="2"
                        />
                        <div className="profile-buttons">
                            <button onClick={handleSave} disabled={uploading}>💾 Save Changes</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;