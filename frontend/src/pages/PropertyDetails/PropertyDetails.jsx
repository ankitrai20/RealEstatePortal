import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/properties")
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

      await axios.delete(
        `http://localhost:5000/property/${property.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <img
          src={`/images/${property.image}`}
          alt={property.title}
          className="w-full h-[450px] object-cover"
        />

        <div className="p-8">
          <h1 className="text-4xl font-bold">
            {property.title}
          </h1>

          <p className="text-gray-600 text-xl mt-3">
            📍 {property.location}
          </p>

          <h2 className="text-3xl text-blue-600 font-bold mt-6">
            ₹ {Number(property.price).toLocaleString("en-IN")}
          </h2>

          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-gray-100 rounded-lg p-5 text-center">
              <h3 className="text-xl font-bold">
                🛏 Bedrooms
              </h3>

              <p className="mt-2">
                {property.bedrooms || "N/A"}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-5 text-center">
              <h3 className="text-xl font-bold">
                🚿 Bathrooms
              </h3>

              <p className="mt-2">
                {property.bathrooms || "N/A"}
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-5 text-center">
              <h3 className="text-xl font-bold">
                📐 Area
              </h3>

              <p className="mt-2">
                {property.area || "N/A"}
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mt-10">
            Description
          </h2>

          <p className="mt-4 text-gray-600 leading-8">
            {property.description}
          </p>

          <div className="flex gap-5 mt-10 flex-wrap">

            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Contact Agent
            </button>

            <Link to={`/edit-property/${property.id}`}>
              <button className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600">
                ✏ Edit Property
              </button>
            </Link>

            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700"
            >
              🗑 Delete Property
            </button>

            <Link to="/">
              <button className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-black">
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