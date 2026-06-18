import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = "http://localhost:8080";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    file: null,
  });

  const token = sessionStorage.getItem("admin_token");

  // ---------------- FETCH PRODUCTS + STATS ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, statsRes] = await Promise.all([
          axios.get(`${API}/api/products/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get(`${API}/api/orders/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProducts(productsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
      }
    };

    fetchData();
  }, []);

  // ---------------- HANDLE INPUT ----------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ---------------- ADD PRODUCT ----------------
  const addProduct = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("stock", form.stock || 1);
    fd.append("categoryId", form.categoryId || 1);

    if (form.file) fd.append("file", form.file);

    try {
      const res = await axios.post(
        `${API}/api/admin/products`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts((prev) => [...prev, res.data]);

      setForm({
        title: "",
        price: "",
        description: "",
        stock: "",
        categoryId: "",
        file: null,
      });
    } catch (err) {
      console.error("Add product failed:", err.response?.data || err.message);
    }
  };

  // ---------------- DELETE PRODUCT ----------------
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Orders</h2>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Total Revenue</h2>
            <p className="text-2xl font-bold">
              ₹{stats.totalRevenue?.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Cancelled</h2>
            <p className="text-2xl font-bold text-red-600">
              {stats.cancelledOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500">Delivered</h2>
            <p className="text-2xl font-bold text-green-600">
              {stats.deliveredOrders}
            </p>
          </div>
        </div>
      )}

      <Link
        to="/admin/orders"
        className="mb-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        View Orders
      </Link>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Product Name" className="border p-2 rounded" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="border p-2 rounded" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" />
          <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border p-2 rounded" />
          <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" type="number" className="border p-2 rounded" />
          <input name="file" type="file" onChange={handleChange} className="border p-2 rounded" />
        </div>

        <button
          onClick={addProduct}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Add Product
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Products</h2>

        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-3">
                  {p.imageUrl ? (
                    <img
                      src={`${API}${p.imageUrl}`}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    "No image"
                  )}
                </td>

                <td className="p-3">{p.title}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.description}</td>

                <td className="p-3">
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}