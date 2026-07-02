import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/properties`)
      .then((res) => res.json())
      .then((data) => {
        const property = data.find(
          (item) => item.id === Number(id)
        );

        if (property) {
          setFormData({
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            image: property.image,
          });
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/property/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    alert(data.message);

    navigate(`/property/${id}`);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-[450px]"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Edit Property
        </h1>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-3 rounded mb-4"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full border p-3 rounded mb-6"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          Update Property
        </button>

      </form>

    </div>
  );
}

export default EditProperty;