import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  const [oldImage, setOldImage] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/properties")
      .then((res) => res.json())
      .then((data) => {
        const property = data.find(
          (item) => item.id === Number(id)
        );

        if (property) {
          setTitle(property.title);
          setDescription(property.description);
          setPrice(property.price);
          setLocation(property.location);
          setOldImage(property.image);
        }
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);

      if (image) {
        formData.append("image", image);
      } else {
        formData.append("image", oldImage);
      }

      const response = await fetch(
        `http://localhost:5000/property/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Property Updated Successfully");
        navigate(`/property/${id}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 py-10">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-[500px]"
      >

        <h1 className="text-3xl font-bold text-center mb-6">
          Edit Property
        </h1>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-3 rounded mb-4"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border p-3 rounded mb-4"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="w-full border p-3 rounded mb-4"
        />

        <div className="mb-4">
          <p className="font-semibold mb-2">Current Image</p>

          <img
            src={oldImage}
            alt="Property"
            className="w-full h-56 object-cover rounded-lg border"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full border p-3 rounded mb-6"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Property"}
        </button>

      </form>

    </div>
  );
}

export default EditProperty;