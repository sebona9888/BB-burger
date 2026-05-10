import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://beebboo-backend.onrender.com/api/v1/auth/login', {
                email,
                password
            });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            alert("Welcome back!");
            navigate('/admin');
        } catch (err) {
            alert(err.response?.data?.message || "Invalid email or password!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            {/* Header */}
            <div className="w-full max-w-md">
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-500 text-sm mb-8 flex items-center gap-1"
                >
                    ← Back to Home
                </button>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
                <p className="text-gray-500 mt-2">Please login to your account</p>
            </div>

            {/* Login Form */}
            <div className="w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                <form onSubmit={handleLogin} className="space-y-4">
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
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="text-right">
                        <p className="text-[#00897b] text-sm cursor-pointer">Forgot Password?</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00897b] text-white py-3 rounded-lg font-semibold hover:bg-[#00695c] transition"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Or login with */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">Or login with</p>
                </div>

                {/* Sign Up Link */}
                <p className="text-center text-gray-600 mt-6">
                    Don't have account?{' '}
                    <span
                        className="text-[#00897b] font-semibold cursor-pointer"
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;