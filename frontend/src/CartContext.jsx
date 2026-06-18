// import { createContext, useState, useEffect } from "react";

// export const CartContext = createContext();

// export function CartProvider({ children }) {
//   const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch cart items
  
//   const fetchCart = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch(`${API_BASE}/api/cart`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json(); // data.items = [{ id, productId, qty, price }]

//       const ids = data.items.map(i => i.productId).join(",");
//       if (ids.length > 0) {
//        const productsRes = await fetch(
//           `${API_BASE}/api/products?ids=${ids}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const productsData = await productsRes.json();

//         // Normalize keys to string to avoid type mismatch
//         const productsMap = Object.fromEntries(
//           productsData.map(p => [p.id.toString(), p])
//         );

//         const cartWithProducts = data.items.map(item => {
//           const prod = productsMap[item.productId.toString()];
//           return {
//             ...item,
//             title: prod?.title || "No title",
//             description: prod?.description || "No description",
//             imageUrl: prod?.imageUrl || null
//           };
//         });

//         setCartItems(cartWithProducts);
//       } else {
//         setCartItems([]);
//       }
//     } catch (err) {
//       console.error("Cart fetch error:", err);
//       setCartItems([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const addToCart = async (productId, qty = 1) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/cart/add`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ productId, qty }),
//       });
//       if (!res.ok) throw new Error("Failed to add to cart");
//       await fetchCart();
//       alert("Product added to cart ✅");
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       alert("Failed to add to cart ❌");
//     }
//     await fetchCart();
//   };

//   const removeItem = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/cart/remove/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//           "Content-Type": "application/json",
//         },
//       });
//       if (!res.ok) throw new Error("Failed to remove item");
//       await fetchCart();
//     } catch (err) {
//       console.error("Remove cart item error:", err);
//     }
//   };

//   const totalPrice = cartItems.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{ cartItems, loading, addToCart, removeItem, totalPrice }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }
import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      // data.items already has: id, productId, productName, price, qty, imageUrl
      setCartItems(data.items ?? []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, qty }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      await fetchCart();
      alert("Product added to cart ✅");
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Failed to add to cart ❌");
    }
    // ✅ removed duplicate fetchCart() call here
  };

  const removeItem = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      await fetchCart();
    } catch (err) {
      console.error("Remove cart item error:", err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, loading, addToCart, removeItem, totalPrice, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
}