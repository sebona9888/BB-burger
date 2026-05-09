import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components & Pages
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';

/**
 * ProtectedRoute: 
 * User-n login gochuu isaa fi Admin ta'uu isaa check godha.
 * Yoo mirga hin qabne gara login-itti deebisa.
 */
const ProtectedRoute = ({ children }) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));

        if (!userInfo || !userInfo.isAdmin) {
            return <Navigate to="/login" replace />;
        }
        return children;
    } catch (error) {
        // Yoo localStorage keessa data dogoggoraatu jiraate
        return <Navigate to="/login" replace />;
    }
};

function App() {
    return (
        <Router>
            {/* Fuula jijjiirru hunda bifa haaraan gara gubbaatti nuuf fida */}
            <ScrollToTop />

            <Routes>
                {/* --- Routes Maamiltootaa (Public) --- */}
                {/* MainLayout keessatti Navbar fi Footer ni dabalatu */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* --- Route Admin (Private/Protected) --- */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* --- 404 Redirect --- */}
                {/* URL hin jirre yoo barreesse gara Home-tti deebisa */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;