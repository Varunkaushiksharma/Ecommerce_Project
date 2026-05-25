import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/Navbar";
import {
  Heart,
  LogOut,
  Mail,
  User,
  Camera,
  ShoppingBag,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(storedUser);

    axios
      .get("http://localhost:8080/api/orders/my-orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);

        if (err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfileImage(reader.result);
      localStorage.setItem("profileImage", reader.result);
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-[#f5f5f7] p-4 md:p-8">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">

        {/* SIDEBAR */}
        <div className="bg-white rounded-3xl p-6 shadow-sm h-fit">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center text-center">

            <div className="relative">

              <img
                src={
                  profileImage ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(user.username)
                }
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
              />

              <label className="absolute bottom-1 right-1 bg-black text-white p-2 rounded-full cursor-pointer hover:scale-105 transition">
                <Camera size={16} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              {user.username}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
          </div>

          {/* ACCOUNT MENU */}
          <div className="mt-8 space-y-3">

            <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-black text-white font-medium">
              <User size={20} />
              My Profile
            </button>

            <button className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 transition font-medium text-gray-700">
              <Heart size={20} />
              WishList
            </button>

            <button  onClick={() => navigate(`/`)}
            className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 transition font-medium text-gray-700  ">
              <ShoppingBag size={20} />
              Shopping
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-50 text-red-500 transition font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="space-y-8">

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Total Orders
              </p>

              <h3 className="text-3xl font-bold mt-2 text-gray-900">
                {orders.length}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Total Spent
              </p>

              <h3 className="text-3xl font-bold mt-2 text-gray-900">
                ₹
                {orders
                  .reduce((acc, order) => acc + order.total, 0)
                  .toFixed(0)}
              </h3>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <p className="text-gray-500 text-sm">
                Account Type
              </p>

              <h3 className="text-3xl font-bold mt-2 text-gray-900">
                User
              </h3>
            </div>
          </div>

          {/* ORDER SECTION */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold text-gray-900">
                Order History
              </h2>

              <span className="text-sm text-gray-500">
                {orders.length} Orders
              </span>
            </div>

            {loading ? (

              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>

            ) : orders.length === 0 ? (

              <div className="py-20 text-center">

                <Package
                  size={60}
                  className="mx-auto text-gray-300"
                />

                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  No Orders Yet
                </h3>

                <p className="mt-2 text-gray-500">
                  Start shopping to see your orders here.
                </p>

                <button
                  onClick={() => navigate("/")}
                  className="mt-6 px-6 py-3 bg-black text-white rounded-2xl hover:opacity-90 transition"
                >
                  Continue Shopping
                </button>
              </div>

            ) : (

              <div className="space-y-5">

                {orders.map((order) => (

                  <div
                    key={order.id}
                    className="border border-gray-100 rounded-3xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                      <div>

                        <p className="text-sm text-gray-500">
                          Order ID
                        </p>

                        <h3 className="font-bold text-lg text-gray-900">
                          #{order.id}
                        </h3>

                        <div className="mt-3 flex flex-wrap gap-3 text-sm">

                          <span className="bg-gray-100 px-3 py-1 rounded-full">
                            ₹{order.total.toFixed(2)}
                          </span>

                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate(`/order/${order.id}`)}
                        className="px-5 py-3 bg-black text-white rounded-2xl hover:opacity-90 transition"
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
