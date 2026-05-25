import React, { useContext } from "react";
import { CartContext } from "../CartContext"; // import your context
import { useNavigate } from "react-router-dom";

export default function Products({ loading, filtered }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <section id="products" className="py-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Products</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
            >
              <div className="h-44 bg-gray-100 animate-pulse rounded-lg" />
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="mt-2 h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <>
              {filtered.map((p, index) => (
                <article
                  key={p.id || p._id || `product-${index}`} // ✅ unique key
                  className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="h-44 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
                    {p.imageUrl ? (
                      <img
                          src={
                            p.imageUrl?.startsWith("http")
                              ? p.imageUrl
                              : `http://localhost:8080${p.imageUrl}`
                          }
                          alt={p.title || p.name}
                          className="object-contain h-full w-full"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-gray-900 truncate">
                    {p.title || p.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {p.description
                      ? p.description.length > 80
                        ? p.description.slice(0, 80) + "..."
                        : p.description
                      : "No description"}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {p.price ? `₹${p.price}` : "—"}
                    </div>
                    <button
                      onClick={() =>navigate(`/view/${p.id || p._id}`)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 active:scale-95 transition"
                    >
                      View
                    </button>
                    {/* <button
                      onClick={() => addToCart(p.id || p._id, 1)}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 active:scale-95 transition"
                    >
                      Add
                    </button> */}
                  </div>
                </article>
              ))}
            </>
          )}
        </div>
      )}
    </section>
  );
}
