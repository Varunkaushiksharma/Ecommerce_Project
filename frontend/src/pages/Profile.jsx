import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 403) {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (!user) {
    // Render nothing while checking
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Profile</h2>
      <p className="text-center mb-6">Username: {user.username}</p>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 mb-8 mx-auto block"
      >
        Logout
      </button>

      <h3 className="text-xl font-semibold mb-4">Order History</h3>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
                <p><strong>Status:</strong> {order.status}</p>
              </div>
              <button
                onClick={() => navigate(`/order/${order.id}`)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}