import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);  // ✅ ADD THIS
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
            alert("Welcome back to Beebboo Burger! 🍔");
            navigate('/admin');
        } catch (err) {
            alert(err.response?.data?.message || "Invalid email or password!");
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
                        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
                        <p className="text-gray-500 mt-2">Please login to your account</p>
                    </div>

                    {/* Login Form */}
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

                            <div className="text-right">
                                <p className="text-[#00897b] text-sm cursor-pointer hover:underline">Forgot Password?</p>
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

export default Login;