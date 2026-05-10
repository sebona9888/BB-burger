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
    const [showPassword, setShowPassword] = useState(false);      // ✅ ADD THIS
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  // ✅ ADD THIS
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
        <div className="min-h-screen flex flex-col bg-white">
            {/* Main Content - Centered */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Hello!</h1>
                        <p className="text-gray-500 mt-2">Welcome to Beebboo Burger</p>
                    </div>

                    {/* Sign Up Form */}
                    <div>
                        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

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

                            <div>
                                <input
                                    type="tel"
                                    placeholder="Phone (Optional)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b]"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {/* ✅ PASSWORD FIELD WITH EYE ICON */}
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

                            {/* ✅ CONFIRM PASSWORD FIELD WITH EYE ICON */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00897b] focus:ring-1 focus:ring-[#00897b] pr-12"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00897b] text-xl"
                                >
                                    {showConfirmPassword ? "🙈" : "👁️"}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#00897b] text-white py-3 rounded-lg font-semibold hover:bg-[#00695c] transition transform hover:scale-[1.02]"
                                disabled={loading}
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="text-center text-gray-600 mt-6">
                            Already have an account?{' '}
                            <span
                                className="text-[#00897b] font-semibold cursor-pointer hover:underline"
                                onClick={() => navigate('/login')}
                            >
                                Login
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 mt-8">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold">Beebbo Burger</h3>
                        <p className="text-gray-400 mt-2 max-w-md mx-auto">
                            Burger mi'aawaa fi qulqulluu Finfineef nannoo ishee keessatti aragchuu dandeessu. Dhandhama addaa fi tajaajila ariifataa!
                        </p>
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="font-semibold mb-3">Quick Links</h4>
                        <div className="flex flex-wrap justify-center gap-4 text-gray-400">
                            <a href="/" className="hover:text-white">Home</a>
                            <a href="/menu" className="hover:text-white">Menu</a>
                            <a href="/about" className="hover:text-white">About Us</a>
                            <a href="/contact" className="hover:text-white">Contact us</a>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h4 className="font-semibold mb-3">Contact Us</h4>
                        <div className="text-gray-400 space-y-1">
                            <p>📍 Addis Ababa, Ethiopia</p>
                            <p>📞 +251 92386748</p>
                            <p>✉️ beebboburger@gmail.com</p>
                        </div>
                    </div>

                    <div className="text-center text-gray-500 text-sm pt-6 border-t border-gray-800">
                        <p>© 2026 Beebboo Burger | Designed by SEBONA HAILE</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Register;