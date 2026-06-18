import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgetPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch(
        "http://localhost:8080/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      alert(data.msg);

    } catch (err) {
      console.error(err);
      alert("Failed to send reset email");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">
        Forgot Password
      </h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-6 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
        required
      />

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
      >
        Send Reset Link
      </button>

      <p className="mt-4 text-center text-gray-600">
        Remember your password?{" "}
        <Link
          to="/login"
          className="text-gray-900 font-semibold"
        >
          Login
        </Link>
      </p>
    </form>
  );
}