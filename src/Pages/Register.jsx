import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // ✅ ADD THIS
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('https://beebboo-burger-backend.onrender.com/api/v1/auth/register', {
                email,
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
        <div className="min-h-screen flex items-center justify-center bg-[#00897b] px-4">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Signup</h2>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:border-[#00897b] transition-all bg-gray-50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* ✅ PASSWORD FIELD WITH SHOW/HIDE TOGGLE */}
                <div className="mb-6 relative">
                    <input
                        type={showPassword ? "text" : "password"}  // ✅ Toggles between text/password
                        placeholder="Create a password"
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:border-[#00897b] transition-all bg-gray-50 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#00897b]"
                    >
                        {showPassword ? "🙈" : "👁️"}  {/* Eye icons */}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#00897b] text-white font-medium p-3 rounded hover:bg-[#00695c] transition-all"
                    disabled={loading}
                >
                    {loading ? "Signing up..." : "Signup"}
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <span className="text-[#00897b] font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
                </p>
            </form>
        </div>
    );
};

export default Register;