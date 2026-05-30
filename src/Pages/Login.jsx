import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

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
            const res = await axios.post('https://prime-backend.onrender.com/api/v1/auth/login', {
                email,
                password
            });

            localStorage.setItem('userInfo', JSON.stringify(res.data));
            toast.success('Welcome back to Beebboo Burger! 🍔');

            const isAdmin = res.data.user?.isAdmin || res.data.isAdmin;
            if (isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid email or password!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
                    <p className="text-gray-500 mt-2">Please login to your account</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b] pr-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00897b] text-xl"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-[#00897b] text-sm hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#00897b] text-white py-3 rounded-lg font-semibold hover:bg-[#00695c] transition transform hover:scale-[1.02]"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <div className="text-center mt-6">
                        <p className="text-gray-400 text-sm">Or login with</p>
                    </div>

                    <p className="text-center text-gray-600 mt-6">
                        Don't have account?{' '}
                        <span
                            className="text-[#00897b] font-semibold cursor-pointer hover:underline"
                            onClick={() => navigate('/register')}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;