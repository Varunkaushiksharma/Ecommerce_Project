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
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminOrderPage from "./AdminOrderPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import View from "./pages/View";
import Map from "./pages/Map";
import "leaflet/dist/leaflet.css";
import VerifyEmail from "./pages/VerifyEmail";

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
          <Route path="/order/:id" element={<OrderDetailsPage />} /> 
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          {/* Always redirect /admin */}
          <Route path="/admin" element={<AdminRedirect />} />

          {/* Admin login */}
          <Route path="/admin/auth" element={<AdminAuth />} />

          {/* Protected admin routes */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashBoard />} />
            <Route path="/admin/orders" element={<AdminOrderPage />} />
            {/* add more admin routes here */}
          </Route>

          <Route path="/checkout" element={<CheckoutPage />} />

           <Route path="/order-success" element={<OrderSuccessPage />} />
           <Route path="/view/:id" element={<View />} />
           <Route path="/map" element={<Map />} />
           <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
    </CartProvider>
  );
}
