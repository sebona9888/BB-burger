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
import Cart from './Pages/Cart/Cart';  // ✅ UPPERCASE C

const ProtectedRoute = ({ children }) => {
    let userInfo = null;
    try {
        const stored = localStorage.getItem("userInfo");
        if (stored) {
            userInfo = JSON.parse(stored);
        }
    } catch (error) {
        console.error("Invalid userInfo in localStorage");
    }

    if (!userInfo || !userInfo.isAdmin) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="menu" element={<Menu />} />
                    <Route path="about" element={<About />} />
                    <Route path="cart" element={<Cart />} />  {/* ✅ UPPERCASE C */}
                    <Route path="contact" element={<Contact />} />
                </Route>

                {/* --- Admin Route --- */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* --- 404 Redirect --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;