import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function PropertyCard({ property }) {

  const {
    wishlist,
    toggleWishlist,
  } = useWishlist();

  const isWishlisted = wishlist.some(
    (item) => item.id === property.id
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <div className="relative">

        <img
          src={`/images/${property.image}`}
          alt={property.title}
          className="w-full h-64 object-cover"
        />

        <button
          onClick={() => toggleWishlist(property)}
          className="absolute top-4 right-4 text-3xl"
        >
          {isWishlisted ? "❤️" : "🤍"}
        </button>

      </div>

      <div className="p-5">

        <h2 className="text-3xl font-bold">

          {property.title}

        </h2>

        <p className="text-gray-500 mt-2">

          📍 {property.location}

        </p>

        <h3 className="text-blue-600 text-4xl font-bold mt-4">

          ₹ {Number(property.price).toLocaleString("en-IN")}

        </h3>

        <p className="mt-4 text-gray-600">

          {property.description}

        </p>

        <Link to={`/property/${property.id}`}>

          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">

            View Details

          </button>

        </Link>

      </div>

    </div>
  );
}

export default PropertyCard;