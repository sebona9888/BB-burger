import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// CartProvider asii badeera (main.jsx keessa waan jiruuf)
import AdminDashboard from './components/AdminDashboard';
import Home from './Pages/Home';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import Login from './Pages/Login';
import Register from './Pages/Register';

const ProtectedRoute = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
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
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;