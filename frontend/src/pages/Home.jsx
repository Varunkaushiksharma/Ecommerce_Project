import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../Component/Navbar";
import Product from "../Component/Product";

export default function Home() {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/products`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data || []);
    } catch (e) {
      console.error("Products fetch error:", e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    (p.title || p.name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section (optional future banner/promo) */}
        <section className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Welcome to <span className="text-gray-700">eComm Connect</span>
          </h1>
          <p className="mt-3 text-gray-600">
            Discover our latest products and best offers.
          </p>
        </section>

        {/* Products */}
        <Product loading={loading} filtered={filtered} />
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div>© {new Date().getFullYear()} eComm Connect — Built with ❤️</div>
          <div className="mt-3 md:mt-0 space-x-4">
            <a
              href="#"
              className="hover:text-gray-800 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="hover:text-gray-800 transition-colors duration-200"
            >
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
