import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import { CartProvider } from "./CartContext"; // import context
import AdminDashBoard from "./AdminDashboard";
import AdminAuth from "./pages/AdminAuth";
import AdminPrivateRoute from "./AdminPrivateRoute";
import AdminRedirect from "./AdminRedirect";

export default function App() {
  return (
    <CartProvider>
    
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* User Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          {/* Always redirect /admin */}
          <Route path="/admin" element={<AdminRedirect />} />

          {/* Admin login */}
          <Route path="/admin/auth" element={<AdminAuth />} />

          {/* Protected admin routes */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            {/* add more admin routes here */}
          </Route>
        </Routes>
    </CartProvider>
  );
}
