import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function Navbar() {

  const { wishlist } = useWishlist();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout Successful!");
    navigate("/login");
  };

  return (

    <nav className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-lg shadow-md">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-extrabold text-blue-600 tracking-wide"
        >
          🏠 EstatePro
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-7">

          <Link
            to="/"
            className="font-medium hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/buy"
            className="font-medium hover:text-blue-600 transition"
          >
            Buy
          </Link>

          <Link
            to="/rent"
            className="font-medium hover:text-blue-600 transition"
          >
            Rent
          </Link>

          <Link
            to="/sell"
            className="font-medium hover:text-blue-600 transition"
          >
            Sell
          </Link>

          <Link
            to="/contact"
            className="font-medium hover:text-blue-600 transition"
          >
            Contact
          </Link>

          {token && (

            <Link
              to="/add-property"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold transition shadow"
            >
              + Add Property
            </Link>

          )}

          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="relative flex items-center gap-2 font-semibold hover:text-red-500 transition"
          >
            ❤️ Wishlist

            <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {wishlist.length}
            </span>

          </Link>

          {!token ? (

            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Login
            </Link>

          ) : (

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition"
            >
              Logout
            </button>

          )}

        </div>

      </div>

    </nav>

  );

}

export default Navbar;