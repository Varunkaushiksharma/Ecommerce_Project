import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Component/Navbar";
import { CartContext } from "../CartContext";
import { Heart, Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function View() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const [liked,setLiked] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f7]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  const imageUrl = product.imageUrl?.startsWith("http")
    ? product.imageUrl
    : `http://localhost:8080${product.imageUrl}`;

  const displayImage = mainImage || imageUrl;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f5f5f7]">
        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 bg-white rounded-lg p-8 shadow-sm">
            {/* LEFT: Image Gallery */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-lg p-8 flex items-center justify-center border border-gray-200 min-h-[500px]">
                <img
                  src={displayImage}
                  alt={product.title}
                  className="max-h-[450px] max-w-full object-contain cursor-zoom-in hover:scale-110 transition-transform duration-300"
                />
                
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                <div
                  onClick={() => setMainImage(null)}
                  className={`w-20 h-20 rounded-lg border-2 cursor-pointer overflow-hidden flex items-center justify-center p-2 transition ${
                    mainImage === null
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt="thumbnail"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Product Details */}
            <div className="md:col-span-3">
              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {product.title}
              </h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Rating Section */}
              {/* <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:text-blue-800">
                  1,234 ratings
                </span>
              </div> */}

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{Math.round(product.price * 1.25)}
                  </span>
                  <span className="text-lg font-bold text-red-600 bg-red-50 px-3 py-1 rounded">
                    20% OFF
                  </span>
                </div>

                {/* EMI Option */}
                {/* <p className="text-sm text-gray-600 mt-2">
                  EMI starting at <span className="font-semibold">₹{Math.round(product.price / 12)}</span>/month
                </p> */}
              </div>

              {/* Stock & Delivery Info */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                <p className="text-green-800 font-semibold mb-3">In Stock</p>
                <div className="space-y-2 text-sm text-gray-700">
                  {/* <div className="flex items-start gap-3">
                    <Truck size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                     <span>
                      <strong>Free delivery</strong> by Mar 25, 2026
                    </span> 
                  </div> */}
                  <div className="flex items-start gap-3">
                    <RotateCcw size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>7-day returns</strong> on this item
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>1-year warranty</strong> included
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <label className="text-sm font-semibold text-gray-900 mb-3 block">
                  Quantity:
                </label>
                <div className="flex items-center gap-3 w-max bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-black font-semibold transition"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-semibold text-gray-900 min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="px-4 py-2 text-gray-600 hover:text-black font-semibold transition"
                  >
                    +
                  </button>
                </div>
                {/* <p className="text-xs text-gray-500 mt-2">Max 10 per customer</p> */}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => addToCart(product.id || product._id, quantity)}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-[1.02] active:scale-95 duration-200"
                >
                  Add to Cart
                </button>
                {/* <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition transform hover:scale-[1.02] active:scale-95 duration-200">
                  Buy Now
                </button> */}
              </div>

              {/* Seller Info */}
              {/* <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-semibold">Sold by:</span> Your Store
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-semibold">Fulfillment:</span> Amazon
                </p>
                <button className="text-blue-600 text-sm font-semibold hover:text-blue-800">
                  See all offers →
                </button>
              </div> */}
            </div>
          </div>

          {/* Product Features & Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {/* About Item */}
            <div className="md:col-span-2 bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Item</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed line-clamp-4">
                    {product.description}
                  </p>
                  {/* <button className="text-blue-600 font-semibold mt-3 hover:text-blue-800">
                    Read more
                  </button> */}
                </div>

                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-black font-bold">•</span>
                      Premium Quality Product
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-black font-bold">•</span>
                      Carefully Crafted Design
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-black font-bold">•</span>
                      Durable & Long Lasting
                    </li>
                    <li className="flex gap-3 text-gray-700">
                      <span className="text-black font-bold">•</span>
                      Customer Satisfaction Guaranteed
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-8 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Specifications
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">CATEGORY</p>
                  <p className="text-gray-900 font-semibold">Electronics</p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">SKU</p>
                  <p className="text-gray-900 font-semibold">{product._id || product.id}</p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">WARRANTY</p>
                  <p className="text-gray-900 font-semibold">1 Year</p>
                </div>
                <hr className="border-gray-200" />
                <div>
                  <p className="text-sm text-gray-500 font-semibold">AVAILABILITY</p>
                  <p className="text-green-600 font-semibold">In Stock</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews Preview */}
          <div className="bg-white rounded-lg p-8 shadow-sm mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-900">John Doe</span>
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                  <p className="font-semibold text-gray-900 mb-2">Great product!</p>
                  <p className="text-gray-700 text-sm mb-3">
                    This product exceeded my expectations. Great quality and fast
                    delivery. Highly recommended!
                  </p>
                  <p className="text-xs text-gray-500">
                    Verified Purchase • 15 days ago
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition">
              See All Reviews →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}