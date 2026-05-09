import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Home from './Pages/Home/Home';
// Hubachiisa: Folder kee "Pages" (P-guddaa) ta'uu fi file-ni kee "Login.jsx" ta'uu mirkaneessi
import Login from './Pages/Login';
import Register from './Pages/Register';

/**
 * ProtectedRoute:
 * User-n login gochuu isaa fi Admin ta'uu isaa check godha.
 */
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

                    {/* ✅ KANNEEN QOFA ITTI SIYF DABALERA (Navbar irra waan jiraniif) */}
                    <Route path="menu" element={<Home />} />
                    <Route path="about" element={<Home />} />
                    <Route path="contact" element={<Home />} />
                </Route>

                {/* --- Admin Route (Protected) --- */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* --- 404 --- */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}

export default App;