import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './Auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [validToken, setValidToken] = useState(true);

    useEffect(() => {
        // Optional: backend token validation can go here
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            toast.error('Passwords do not match', { position: 'top-center' });
            return;
        }

        // Validate password length
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters', { position: 'top-center' });
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `https://beebboo-backend.onrender.com/api/v1/auth/reset-password/${token}`,
                { password }
            );

            toast.success('Password reset successful! Please login.', {
                position: 'top-center',
            });

            navigate('/login');
        } catch (err) {
            toast.error(
                err.response?.data?.message || 'Invalid or expired token',
                { position: 'top-center' }
            );
            setValidToken(false);
        } finally {
            setLoading(false);
        }
    };

    // If token is invalid
    if (!validToken) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Invalid or Expired Link</h2>
                    <p>The password reset link is invalid or has expired.</p>
                    <Link to="/forgot-password" className="auth-link">
                        Request a new reset link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Create New Password</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;