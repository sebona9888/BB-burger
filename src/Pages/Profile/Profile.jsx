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

        // Data user-ri qindeessuuf
        const currentData = user.user || user;
        setFormData({
            name: currentData.name || '',
            email: currentData.email || '',
            phone: currentData.phone || '',
            address: currentData.address || ''
        });
        setImagePreview(currentData.profileImage || '');
    }, [navigate]);

    // 1. Cloudinary Upload Logic
    const uploadToCloudinary = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', 'beebboo_uploads'); // Preset kee isa 'Unsigned' sana

        const response = await fetch('https://api.cloudinary.com/v1_1/dc1cr58z9/image/upload', {
            method: 'POST',
            body: fd
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

        return data.secure_url;
    };

    // 2. Image Selection & Preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Suuraan kun baay\'ee guddaa dha! (Max 2MB)');
            return;
        }

        setImagePreview(URL.createObjectURL(file));
        setProfileImage(file);
    };

    // 3. Save All Changes
    const handleSave = async () => {
        setUploading(true);
        const loadingId = toast.loading('Profile update gochaa jira...');

        try {
            let imageUrl = imagePreview;

            // Suuraan haaraa yoo filatame qofa upload godha
            if (profileImage) {
                imageUrl = await uploadToCloudinary(profileImage);
            }

            const updatedUser = {
                ...userInfo,
                user: {
                    ...(userInfo.user || userInfo),
                    ...formData,
                    profileImage: imageUrl
                }
            };

            // LocalStorage fi State update gochuu
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));
            setUserInfo(updatedUser);
            setIsEditing(false);
            setProfileImage(null);

            toast.success('Profile kee milkaa\'inaan jijjiirameera! ✅', { id: loadingId });
        } catch (error) {
            toast.error(`Dogoggora: ${error.message}`, { id: loadingId });
        } finally {
            setUploading(false);
        }
    };

    if (!userInfo) return <div className="loader">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="image-wrapper">
                        <img
                            src={imagePreview || 'https://via.placeholder.com/150?text=Beebboo'}
                            alt="Profile"
                            className="profile-avatar"
                        />
                        {isEditing && (
                            <label className="upload-label">
                                📷 Change
                                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                            </label>
                        )}
                    </div>
                    <h2>{formData.name || 'User'}</h2>
                </div>

                <div className="profile-body">
                    {isEditing ? (
                        <div className="edit-form">
                            <input type="text" value={formData.name} placeholder="Full Name"
                                onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <input type="email" value={formData.email} disabled className="disabled-input" />

                            <input type="tel" value={formData.phone} placeholder="Phone Number"
                                onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            <textarea value={formData.address} placeholder="Delivery Address"
                                onChange={e => setFormData({ ...formData, address: e.target.value })} />

                            <div className="button-group">
                                <button className="save-btn" onClick={handleSave} disabled={uploading}>
                                    {uploading ? 'Saving...' : '💾 Save'}
                                </button>
                                <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className="view-info">
                            <div className="info-item"><span>📧 Email:</span> {formData.email}</div>
                            <div className="info-item"><span>📞 Phone:</span> {formData.phone || '---'}</div>
                            <div className="info-item"><span>📍 Address:</span> {formData.address || '---'}</div>

                            <div className="button-group">
                                <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                                <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>🚪 Logout</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;