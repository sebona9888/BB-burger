import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import OrderHistory from './Pages/OrderHistory/OrderHistory';
import Checkout from './Pages/Checkout/Checkout';

// Components & Pages
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Home from './Pages/Home/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Menu from './Pages/Menu/Menu';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import Cart from './Pages/Cart/Cart';
import Payment from './Pages/Payment/Payment';
import Profile from './Pages/Profile/Profile';
import Analytics from './Pages/Analytics/Analytics';

const AdminRoute = ({ children }) => {
    let userInfo = null;
    try {
        const stored = localStorage.getItem("userInfo");
        if (stored) userInfo = JSON.parse(stored);
    } catch (error) {
        console.error("Invalid userInfo in localStorage");
    }
    if (!userInfo || !userInfo.user?.isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const UserRoute = ({ children }) => {
    let userInfo = null;
    try {
        const stored = localStorage.getItem("userInfo");
        if (stored) userInfo = JSON.parse(stored);
    } catch (error) {
        console.error("Invalid userInfo in localStorage");
    }
    if (!userInfo) return <Navigate to="/login" replace />;
    return children;
};

function App() {
    return (
        <>
            <Toaster
                position="top-center"                    // ✅ fixed
                toastOptions={{
                    duration: 4000,
                    style: { background: '#333', color: '#fff', borderRadius: '10px' },
                    success: { style: { background: '#00897b' }, icon: '🍔' },
                    error: { style: { background: '#f44336' }, icon: '❌' },
                }}
            />
            <Router>
                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="menu" element={<Menu />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />

                        {/* Protected routes inside MainLayout */}
                        <Route path="cart" element={<UserRoute><Cart /></UserRoute>} />
                        <Route path="checkout" element={<UserRoute><Checkout /></UserRoute>} />
                        <Route path="payment" element={<UserRoute><Payment /></UserRoute>} />
                        <Route path="my-orders" element={<UserRoute><OrderHistory /></UserRoute>} />

                        {/* ✅ Profile moved inside MainLayout */}
                        <Route path="profile" element={<UserRoute><Profile /></UserRoute>} />
                    </Route>

                    {/* Analytics – admin only, outside MainLayout (or could be inside if you want navbar) */}
                    <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />

                    {/* Admin dashboard – admin only */}
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;