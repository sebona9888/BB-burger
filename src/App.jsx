import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './components/AdminDashboard';
import Home from './pages/Home';
import ScrollToTop from './components/ScrollToTop';
import MainLayout from './Layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';

// ✅ 1. ProtectedRoute Sirreeffame (Token fi Admin check godha)
const ProtectedRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Yoo maamilli login hin goone ykn Admin miti ta'e gara Login-itti deebisa
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

          {/* ✅ Route Admin (Private/Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ Yoo URL dogoggoraa barreesse gara Home-tti deebisa */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </Router>
  );
}

export default App;