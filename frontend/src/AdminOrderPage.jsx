import React, { useEffect, useState } from "react";

export default function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOrderId, setOpenOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("admin_token");

      const res = await fetch("http://localhost:8080/api/orders/all-order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const updateStatus = async (orderId, newStatus) => {
  try {
    const token = sessionStorage.getItem("admin_token");

    const res = await fetch(
      `http://localhost:8080/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to update status");
    }

    fetchOrders(); // refresh table
  } catch (err) {
    alert(err.message);
  }
};

  if (loading) return <div className="p-8">Loading Orders...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>

      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Shipping Address</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
  {orders.map((order) => (
    <React.Fragment key={order.id}>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-3">{order.id}</td>

        <td className="p-3">{order.user?.username}</td>

        <td className="p-3">{order.user?.email}</td>

        <td className="p-3 font-semibold">
          ₹{order.total.toFixed(2)}
        </td>

        <td className="p-3">
          <select
            value={order.status}
            onChange={(e) => updateStatus(order.id, e.target.value)}
            className="border p-1 rounded"
          >
            <option value="CREATED">CREATED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </td>

        <td className="p-3">{order.shippingAddress}</td>

        <td className="p-3">
          <button
            onClick={() =>
              setOpenOrderId(openOrderId === order.id ? null : order.id)
            }
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            {openOrderId === order.id ? "Hide" : "View"} Items
          </button>
        </td>

        <td className="p-3">
          {new Date(order.createdAt).toLocaleString()}
        </td>
      </tr>

      {openOrderId === order.id && (
        <tr>
          <td colSpan="8" className="bg-gray-50 p-4">
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border p-3 rounded bg-white"
                >
                  <div>
                    <p className="font-semibold">
                      {item.product.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>

                  <div>
                    ₹{item.price} × {item.qty} = ₹
                    {(item.price * item.qty).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}