import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    file: null,
  });

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Add product with image
  const addProduct = async () => {
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("stock", form.stock || 1);
    fd.append("categoryId", form.categoryId || 1); // adjust if categories dynamic
    if (form.file) fd.append("file", form.file);

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/admin/products", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });


    if (res.ok) {
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setForm({
        title: "",
        price: "",
        description: "",
        stock: "",
        categoryId: "",
        file: null,
      });
    } else {
      console.error("Failed to add product");
    }
  };

  // Delete product
 const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      console.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Product Name"
            value={form.title}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="number"
            name="categoryId"
            placeholder="Category ID"
            value={form.categoryId}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="border rounded-lg p-2 w-full"
          />
        </div>
        <button
          onClick={addProduct}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {p.imageUrl ? (
                    <img
                      src={`http://localhost:8080${p.imageUrl}`}
                      alt={p.title}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </td>
                <td className="p-3">{p.title}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.description}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
