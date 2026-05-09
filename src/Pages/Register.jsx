import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ✅ Linkii Backend kee isa sirrii kallaattiin asitti dabalera
            await axios.post('https://beebboo-burger-backend.onrender.com/api/v1/auth/register', {
                name,
                email,
                password
            });
            alert("Galmee milkiidhaan xumurtaniittu! Amma Login godhaa.");
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || "Dogoggorri uumameera!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
            >
                <h2 className="text-3xl font-extrabold mb-2 text-center text-orange-600">Beebboo Burger</h2>
                <p className="text-center text-gray-500 mb-8">Create your new account</p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maqaa Guutuu</label>
                    <input
                        type="text"
                        placeholder="Maqaa kee galchi"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="example@mail.com"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-600 text-white font-bold p-3 rounded-xl hover:bg-orange-700 transform active:scale-95 transition-all shadow-lg shadow-orange-200"
                    disabled={loading}
                >
                    {loading ? "Galmaa'a jira..." : "Register"}
                </button>

                <p className="mt-6 text-center text-gray-600">
                    Kanaan dura galmoofteettaa? <span className="text-orange-600 font-bold cursor-pointer hover:underline" onClick={() => navigate('/login')}>Login</span>
                </p>
            </form>
        </div>
    );
};

export default Register;