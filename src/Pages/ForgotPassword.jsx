import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './Auth.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Show a loading toast
        const loadingToast = toast.loading('Sending reset link...', { position: 'top-center' });

        try {
            await axios.post('https://beebboo-backend.onrender.com/api/v1/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset link sent to your email!', { id: loadingToast, position: 'top-center' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong', { id: loadingToast, position: 'top-center' });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Check your email</h2>
                    <p>We've sent a password reset link to <strong>{email}</strong>.</p>
                    <p>Click the link in the email to reset your password.</p>
                    <Link to="/login" className="auth-link">Back to Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Forgot Password?</h2>
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>
                <div className="auth-footer">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;