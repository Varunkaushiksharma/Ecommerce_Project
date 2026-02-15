import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setOrder(data);
    setLoading(false);
  };

  const cancelOrder = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:8080/api/orders/${id}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Order cancelled!");
      fetchOrder(); // refresh
    } else {
      alert("Cannot cancel this order");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!order) return <div className="p-8">Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">
          Order #{order.id}
        </h1>

        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.total}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          Items
        </h2>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="border p-3 rounded mb-2 flex justify-between"
          >
            <div>
              <p className="font-semibold">
                {item.product.title}
              </p>
              <p>Qty: {item.qty}</p>
            </div>
            <div>
              ₹{item.price} × {item.qty}
            </div>
          </div>
        ))}

        {order.status === "CREATED" && (
          <button
            onClick={cancelOrder}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
          >
            Cancel Order
          </button>
        )}

        <button
          onClick={() => navigate(-1)}
          className="ml-4 mt-6 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}