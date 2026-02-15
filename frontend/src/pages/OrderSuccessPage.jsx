import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Order Placed Successfully!</h1>
      {orderId && <p className="mb-2">Order ID: <strong>{orderId}</strong></p>}
      {total && <p className="mb-4">Total: ₹{total.toFixed(2)}</p>}
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}