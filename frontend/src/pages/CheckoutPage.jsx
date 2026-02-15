import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/Navbar";
import { CartContext } from "../CartContext.jsx";

export default function CheckoutPage() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useContext(CartContext);

  const handleCheckout = async () => {
    if (!address.trim()) {
      alert("Please enter shipping address");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "/api/orders/checkout",
        { shippingAddress: address },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      navigate("/order-success", { state: res.data });
    } catch (err) {
      alert("Checkout failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-semibold mb-3">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>{item.title} × {item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold mt-4">
            <span>Total</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-4 rounded shadow">
          <label className="block text-sm font-medium mb-2">
            Shipping Address
          </label>
          <textarea
            className="w-full border rounded p-2 mb-4"
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </main>
    </div>
  );
}