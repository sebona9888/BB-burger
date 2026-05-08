import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('https://beebboo-backend.onrender.com/api/users/login', {
                email,
                password
            });

            // 🔑 Token fi ragaa User-ichaa kuffisuu
            localStorage.setItem('userInfo', JSON.stringify(res.data));

            alert("Baga nagaaan dhufte!");
            navigate('/admin'); // Erga seenee booda gara Admin Dashboard ergi
        } catch (err) {
            alert(err.response?.data?.message || "Email ykn Password dogoggora!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Login - Beebboo</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Email Address</label>
                    <input
                        type="email"
                        className="w-full p-2 border rounded mt-1 focus:outline-orange-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded mt-1 focus:outline-orange-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700 transition"
                    disabled={loading}
                >
                    {loading ? "Seenaa jira..." : "Login"}
                </button>

                <p className="mt-4 text-center text-sm">
                    Account hin qabduu? <span className="text-orange-600 cursor-pointer" onClick={() => navigate('/register')}>Galmaa'i</span>
                </p>
            </form>
        </div>
    );
};

export default Login;