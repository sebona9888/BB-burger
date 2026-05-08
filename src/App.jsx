import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './components/AdminDashboard';
import Home from './Pages/Home'; // ✅ 'pages' gara 'Pages' tti jijjiirame
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import Login from './Pages/Login'; // ✅ 'pages' gara 'Pages' tti jijjiirame
import Register from './Pages/Register'; // ✅ 'pages' gara 'Pages' tti jijjiirame

// ✅ ProtectedRoute: Admin qofatu Dashboard seenuu danda'a
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
            <CartProvider>
                <ScrollToTop />
                <Routes>
                    {/* ✅ Routes Maamiltootaa (Public) */}
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                    </Route>

                    {/* ✅ Route Admin (Private) */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* ✅ 404 Redirect: Yoo URL dogoggoraa barreesse gara Home deebisa */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </CartProvider>
        </Router>
    );
}

export default App;