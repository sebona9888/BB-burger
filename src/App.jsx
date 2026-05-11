import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

// ✅ For Admin only - checks isAdmin
const AdminRoute = ({ children }) => {
    let userInfo = null;
    try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            userInfo = JSON.parse(stored);
        }
    } catch (error) {
        console.error("Invalid userInfo in localStorage");
    }

    if (!userInfo || !userInfo.user?.isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// ✅ For any logged-in user (regular or admin)
const UserRoute = ({ children }) => {
    let userInfo = null;
    try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            userInfo = JSON.parse(stored);
        }
    } catch (error) {
        console.error("Invalid userInfo in localStorage");
    }

    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
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

                    {/* ✅ Protected routes - require login */}
                    <Route path="cart" element={
                        <UserRoute>
                            <Cart />
                        </UserRoute>
                    } />
                    <Route path="payment" element={
                        <UserRoute>
                            <Payment />
                        </UserRoute>
                    } />
                </Route>

                {/* ✅ Admin only route */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;