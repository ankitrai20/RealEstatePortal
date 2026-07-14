import MortgageCalculator from "../../components/MortgageCalculator";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import PropertyMap from "../../components/PropertyMap";

const API = import.meta.env.VITE_API_URL;

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/properties`)
      .then((res) => {
        const selectedProperty = res.data.find(
          (item) => item.id === Number(id)
        );

        setProperty(selectedProperty);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  // ================= DELETE PROPERTY =================

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/property/${property.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Property Deleted Successfully");
      navigate("/");
    } catch (err) {
      console.log(err);

      if (err.response) {
        alert(err.response.data.message);
      } else {
        alert("Server Error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Property Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">

        <img
          src={property.image}
          alt={property.title}
          className="w-full h-[500px] object-cover"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/1200x600?text=No+Image";
          }}
        />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            {property.title}
          </h1>

          <p className="text-xl text-gray-500 mt-3">
            📍 {property.location}
          </p>

          <h2 className="text-blue-600 text-4xl font-bold mt-5">
            ₹ {Number(property.price).toLocaleString("en-IN")}
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-10">

            <div className="bg-blue-50 rounded-xl p-6 text-center shadow">
              <h3 className="text-xl font-bold">🛏 Bedrooms</h3>
              <p className="mt-3 text-lg">
                {property.bedrooms || "N/A"}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 text-center shadow">
              <h3 className="text-xl font-bold">🚿 Bathrooms</h3>
              <p className="mt-3 text-lg">
                {property.bathrooms || "N/A"}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6 text-center shadow">
              <h3 className="text-xl font-bold">📐 Area</h3>
              <p className="mt-3 text-lg">
                {property.area || "N/A"}
              </p>
            </div>

          </div>

          <h2 className="text-3xl font-bold mt-12">
            Description
          </h2>

          <p className="mt-5 text-gray-600 leading-8 text-lg">
            {property.description}
          </p>

          <h2 className="text-3xl font-bold mt-12 mb-6">
            📍 Property Location
          </h2>

          <PropertyMap
            title={property.title}
            location={property.location}
            price={property.price}
          />

          <MortgageCalculator
            propertyPrice={property.price}
          />

          <div className="flex flex-wrap gap-5 mt-12">

            <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-8 py-3 rounded-xl shadow">
              📞 Contact Agent
            </button>

            <Link to={`/edit-property/${property.id}`}>
              <button className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-8 py-3 rounded-xl shadow">
                ✏ Edit Property
              </button>
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 transition text-white px-8 py-3 rounded-xl shadow"
            >
              🗑 Delete Property
            </button>

            <Link to="/">
              <button className="bg-gray-800 hover:bg-black transition text-white px-8 py-3 rounded-xl shadow">
                ← Back
              </button>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default PropertyDetails;