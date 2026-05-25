import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Component/Navbar";
import { CartContext } from "../CartContext.jsx";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationPicker({ setPosition, fetchAddress }) {

  useMapEvents({

    click(e) {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setPosition([lat, lng]);

      fetchAddress(lat, lng);
    },

  });

  return null;
}

export default function CheckoutPage() {

  const [address, setAddress] = useState("");

  const [manualAddress, setManualAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const [position, setPosition] = useState(null);

  const navigate = useNavigate();

  const { cartItems, totalPrice } = useContext(CartContext);

  // GET ADDRESS FROM COORDINATES
  const fetchAddress = async (lat, lng) => {

    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      setAddress(data.display_name);

    } catch (err) {

      console.log(err);

    }
  };

  // GET USER LOCATION
  useEffect(() => {

    navigator.geolocation.getCurrentPosition(

      (location) => {

        const lat = location.coords.latitude;
        const lng = location.coords.longitude;

        setPosition([lat, lng]);

        fetchAddress(lat, lng);
      },

      (err) => {
        console.log(err);
      }

    );

  }, []);

  // CHECKOUT
  const handleCheckout = async () => {

    const finalAddress =
      manualAddress.trim() + ", " + address;

    if (!finalAddress.trim()) {
      alert("Please enter shipping address");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(

        "/api/orders/checkout",

        {
          shippingAddress: finalAddress,
          latitude: position?.[0],
          longitude: position?.[1],
        },

        {
          headers: {
            Authorization:
              "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      navigate("/order-success", {
        state: res.data,
      });

    } catch (err) {

      alert("Checkout failed");

      console.error(err);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-gray-50 text-gray-900">

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8">

        <h1 className="text-3xl font-bold mb-6">
          Checkout
        </h1>

        {/* ORDER SUMMARY */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">

          <h2 className="font-semibold text-lg mb-4">
            Order Summary
          </h2>

          {cartItems.map((item) => (

            <div
              key={item.id}
              className="flex justify-between text-sm mb-3"
            >
              <span>
                {item.title} × {item.qty}
              </span>

              <span>
                ₹{item.price * item.qty}
              </span>
            </div>

          ))}

          <div className="flex justify-between font-bold text-lg mt-6">

            <span>Total</span>

            <span>
              ₹{totalPrice.toFixed(2)}
            </span>

          </div>
        </div>

        {/* ADDRESS SECTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">

          <h2 className="font-semibold text-lg mb-4">
            Delivery Address
          </h2>

          {/* MANUAL FIELD */}
          <input
            type="text"
            placeholder="Flat / House No / Landmark"
            className="w-full border rounded-xl p-3 mb-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={manualAddress}
            onChange={(e) =>
              setManualAddress(e.target.value)
            }
          />

          {/* AUTO ADDRESS */}
          <textarea
            className="w-full border rounded-xl p-3 mb-4 bg-gray-50"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* MAP */}
          <div className="mb-6">

            {position ? (

              <MapContainer
                center={position}
                zoom={13}
                className="h-[350px] w-full rounded-2xl"
              >

                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={position} />

                <LocationPicker
                  setPosition={setPosition}
                  fetchAddress={fetchAddress}
                />

              </MapContainer>

            ) : (

              <div className="h-[350px] flex items-center justify-center bg-gray-100 rounded-2xl">
                Loading Map...
              </div>

            )}

          </div>

          {/* BUTTON */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-2xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >

            {loading
              ? "Processing..."
              : "Confirm Order"}

          </button>

        </div>

      </main>

    </div>
  );
}