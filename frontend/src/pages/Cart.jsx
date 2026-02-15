import React, { useContext } from "react";
import Navbar from "../Component/Navbar";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, loading, removeItem, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 bg-white rounded-lg shadow-sm animate-pulse">
                <div className="h-24 bg-gray-100 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500">Your cart is empty.</div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id || item.productId}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-md flex items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={`http://localhost:8080${item.imageUrl}`}
                        alt={item.title}
                        className="object-contain h-full"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-sm text-gray-900 mt-1">
                      ₹{item.price} x {item.qty}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-500 transition"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex justify-end mt-4 text-lg font-semibold">
              Total: ₹{totalPrice.toFixed(2)}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
