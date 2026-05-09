import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import AdminDashboard from './components/AdminDashboard'; // ✅ 'components' qubee xiqqaadhaan
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';

// ProtectedRoute: Admin qofatu Dashboard seenuu danda'a
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
                {/* Routes Maamiltootaa (Public) */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                {/* Route Admin (Private) */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* 404 Redirect: Yoo URL dogoggoraa barreesse gara Home deebisa */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;