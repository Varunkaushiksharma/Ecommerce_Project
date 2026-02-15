// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: "", password: "" });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       const data = await res.json();
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify({ username: data.username }));
//       navigate("/"); // redirect to home
//     } else {
//       const error = await res.json();
//       alert(error.error || "Login failed");
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md"
//     >
//       <h2 className="text-2xl font-semibold mb-6 text-gray-900">Login</h2>
//       <input
//         placeholder="Username"
//         onChange={(e) => setForm({ ...form, username: e.target.value })}
//         className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setForm({ ...form, password: e.target.value })}
//         className="w-full mb-6 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
//       />
//       <button
//         type="submit"
//         className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
//       >
//         Login
//       </button>
//     </form>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || "Login failed");
        return;
      }

      const data = await res.json();

      // Save the full user object if backend returns it
      const userObj = data.user ? data.user : { username: form.username };

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userObj));

      navigate("/"); // go to home
    } catch (err) {
      console.error(err);
      alert("Login failed. Check console.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900">Login</h2>
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full mb-6 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition"
      >
        Login
      </button>
    </form>
  );
}
