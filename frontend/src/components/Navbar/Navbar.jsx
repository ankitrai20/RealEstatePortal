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

    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">

        {/* Logo */}

        <Link
          to="/"
          className="text-3xl font-bold text-blue-600"
        >
          RealEstate
        </Link>

        {/* Navigation */}

        <div className="flex items-center gap-8">

          <Link
            to="/"
            className="hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          <Link
            to="/buy"
            className="hover:text-blue-600 font-medium"
          >
            Buy
          </Link>

          <Link
            to="/rent"
            className="hover:text-blue-600 font-medium"
          >
            Rent
          </Link>

          <Link
            to="/sell"
            className="hover:text-blue-600 font-medium"
          >
            Sell
          </Link>

          <Link
            to="/contact"
            className="hover:text-blue-600 font-medium"
          >
            Contact
          </Link>

          {token && (

            <Link
              to="/add-property"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Add Property
            </Link>

          )}

          {/* Wishlist */}

          <Link
            to="/wishlist"
            className="relative text-3xl"
          >
            🤍

            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {wishlist.length}
            </span>

          </Link>

          {!token ? (

            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>

          ) : (

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
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