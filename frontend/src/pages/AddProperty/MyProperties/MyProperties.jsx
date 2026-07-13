import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyProperties() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProperties: 0,
    wishlistCount: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, []);

  // ================= FETCH MY PROPERTIES =================

  const fetchProperties = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/my-properties",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setProperties(data);

    } catch (err) {

      console.log(err);

    }

    setLoading(false);

  };

  // ================= FETCH DASHBOARD STATS =================

  const fetchStats = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/dashboard-stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setStats(data);

    } catch (err) {

      console.log(err);

    }

  };

  // ================= DELETE PROPERTY =================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this property?")) return;

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/property/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      alert(data.message);

      fetchProperties();
      fetchStats();

    } catch (err) {

      console.log(err);

    }

  };

  if (loading) {

    return (
      <h1 className="text-center text-3xl mt-20">
        Loading...
      </h1>
    );

  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        My Dashboard
      </h1>

      {/* ================= DASHBOARD STATS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-blue-600 text-white rounded-xl shadow-lg p-6">

          <h2 className="text-xl font-semibold">
            🏠 Total Properties
          </h2>

          <p className="text-5xl font-bold mt-3">
            {stats.totalProperties}
          </p>

        </div>

        <div className="bg-pink-600 text-white rounded-xl shadow-lg p-6">

          <h2 className="text-xl font-semibold">
            ❤️ Wishlist
          </h2>

          <p className="text-5xl font-bold mt-3">
            {stats.wishlistCount}
          </p>

        </div>

        <div className="bg-green-600 text-white rounded-xl shadow-lg p-6">

          <h2 className="text-xl font-semibold">
            💰 Total Property Value
          </h2>

          <p className="text-3xl font-bold mt-3">
            ₹ {Number(stats.totalValue).toLocaleString("en-IN")}
          </p>

        </div>

      </div>

      <h2 className="text-3xl font-bold mb-8">
        My Properties
      </h2>

      {properties.length === 0 ? (

        <h2 className="text-center text-xl">
          No Property Found
        </h2>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {properties.map((property) => (

            <div
              key={property.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >

              <img
                src={property.image}
                alt={property.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">

                <h2 className="text-2xl font-bold">
                  {property.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  📍 {property.location}
                </p>

                <h3 className="text-blue-600 text-2xl font-bold mt-3">
                  ₹ {Number(property.price).toLocaleString("en-IN")}
                </h3>

                <div className="flex gap-3 mt-6">

                  <Link
                    to={`/property/${property.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit-property/${property.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(property.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default MyProperties;