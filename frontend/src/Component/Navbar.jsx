import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";

export default function Navbar({ search, setSearch }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/"); // redirect to home
  };

  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-36 flex items-center justify-center rounded-md bg-gray-300 text-gray-700 font-semibold tracking-tight">
                eComm Connect
              </div>
            </div>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              <a className="px-3 py-2 rounded hover:bg-gray-200" href="/">
                Home
              </a>
              <Link to="/products" className="px-3 py-2 rounded hover:bg-gray-200">
                Products
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden sm:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-64 px-3 py-2 border border-gray-200 rounded-md bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Cart */}
            <Link to="/cart">
              <button
                aria-label="cart"
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Cart</span>
            </button>
            </Link>

            {/* Auth/Profile */}
            <div className="hidden sm:flex items-center gap-2">
              {!user && (
                <Link to="/signup">
                  <button className="px-3 py-2 rounded-md text-sm border border-gray-200 hover:bg-gray-200">
                    Sign Up
                  </button>
                </Link>
              )}

              {user && (
                <div className="relative flex items-center gap-2">
                  <Link to="/profile">
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white hover:brightness-90 cursor-pointer">
                      <User className="h-4 w-4" />
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
