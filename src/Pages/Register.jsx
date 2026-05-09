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
            await axios.post('https://beebboo-backend.onrender.com/api/users/register', {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Register - Beebboo</h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Maqaa Guutuu</label>
                    <input type="text" className="w-full p-2 border rounded mt-1" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Email Address</label>
                    <input type="email" className="w-full p-2 border rounded mt-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" className="w-full p-2 border rounded mt-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="w-full bg-orange-600 text-white p-2 rounded hover:bg-orange-700" disabled={loading}>
                    {loading ? "Galmaa'a jira..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;