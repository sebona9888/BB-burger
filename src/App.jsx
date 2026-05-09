import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages
// Hubachiisa: Folder-oonni kee Pages fi components (P fi C guddaa) ta'uu mirkaneessi
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login'; // Yoo folder Login keessa file Login.jsx jiraate
import Register from './Pages/Register/Register';

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

    // Yoo user-ni login hin goone ykn Admin hin ta'in gara login-itti deebisa
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
                {/* --- Public Routes (Hundaaf) --- */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* --- Admin Route (Eegumsa Qabu) --- */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* --- 404 Redirect --- */}
                {/* Yoo path-ni hin beekamne gara home-itti deebisa */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}

export default App;