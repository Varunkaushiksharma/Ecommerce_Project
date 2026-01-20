import { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Product from "../Component/Product";

export default function ProductsPage() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products
  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/products`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        if (mounted) setProducts(data || []);
      } catch (e) {
        console.error("Products fetch error:", e);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProducts();
    return () => (mounted = false);
  }, [API_BASE]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        console.error("Categories fetch error:", err);
      }
    }
    fetchCategories();
  }, [API_BASE]);

  // Filter products
  const filtered = products.filter((p) => {
    const matchesSearch = (p.title || "").toLowerCase().includes(search.toLowerCase());
    const productCategory = (p.category?.slug || "").toLowerCase();
    const matchesCategory =
      selectedCategory === "all" || productCategory === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

// Add to cart
  const addToCart = async (productId, qty = 1) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, qty }),
    });

    if (!res.ok) throw new Error("Failed to add to cart");

    const data = await res.json();
    console.log("Added to cart:", data);
    alert("Product added to cart!");
  } catch (err) {
    console.error("Add to cart error:", err);
    alert("Failed to add product to cart");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar search={search} setSearch={setSearch} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            key="all"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full  text-sm border font-medium transition ${
              selectedCategory === "all"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm border font-medium transition ${
                selectedCategory === cat.slug
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
          <Product loading={loading} filtered={filtered}/>
      </main>
    </div>
  );
}
