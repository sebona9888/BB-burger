import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // ✅ DEBUGGING: Log what we're about to send
        console.log("🔍 DEBUG - Form Data:");
        console.log("  name:", name);
        console.log("  username:", username);
        console.log("  email:", email);
        console.log("  password:", password);

        setLoading(true);

        try {
            // ✅ DEBUGGING: Log the API call
            console.log("📡 Calling API endpoint: /auth/register");
            console.log("📡 Full URL:", api.defaults.baseURL + '/auth/register');

            const response = await api.post('/auth/register', {
                name: name,
                username: username,
                email: email,
                password: password
            });

            console.log("✅ SUCCESS:", response.data);
            alert("Account created successfully! Please login.");
            navigate('/login');

        } catch (err) {
            console.error("❌ ERROR - Full error object:", err);
            console.error("❌ ERROR - Response data:", err.response?.data);
            console.error("❌ ERROR - Status code:", err.response?.status);

            // Show specific error message
            if (err.response?.data?.message) {
                alert(`Registration failed: ${err.response.data.message}`);
            } else if (err.response?.data?.errors) {
                // Handle validation errors
                const errorMessages = Object.values(err.response.data.errors).join('\n');
                alert(`Validation failed:\n${errorMessages}`);
            } else {
                alert("Registration failed! Check console for details.");
            }
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
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:border-[#00897b] transition-all bg-gray-50"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Choose a username"
                        className="w-full p-3 border border-gray-200 rounded focus:outline-none focus:border-[#00897b] transition-all bg-gray-50"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

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

                <div className="mb-6 relative">
                    <input
                        type={showPassword ? "text" : "password"}
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
                        {showPassword ? "🙈" : "👁️"}
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
                    Already have an account?{' '}
                    <span className="text-[#00897b] font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;