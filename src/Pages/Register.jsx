import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name,
                username,
                email,
                phone,
                password
            });

            alert("Account created successfully! Please login.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            {/* Header */}
            <div className="w-full max-w-md">
                <button
                    onClick={() => navigate('/login')}
                    className="text-gray-500 text-sm mb-8 flex items-center gap-1"
                >
                    ← Back to login
                </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Hello!</h1>
                <p className="text-gray-500 mt-2">Welcome to plantland</p>
            </div>

            {/* Sign Up Form */}
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Login"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="tel"
                            placeholder="Phone"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00897b] text-white py-3 rounded-lg font-semibold hover:bg-[#00695c] transition"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6">
                    Don't have account?{' '}
                    <span
                        className="text-[#00897b] font-semibold cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;