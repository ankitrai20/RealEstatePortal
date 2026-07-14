import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProperty.css";

const API = import.meta.env.VITE_API_URL;

function AddProperty() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !price ||
      !location ||
      !image
    ) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("location", location);
      formData.append("image", image);

      const response = await fetch(`${API}/property`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Property Added Successfully!");
        navigate("/");
      } else {
        alert(data.message || "Failed to add property");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-container">
      <div className="add-card">
        <h1>Add Property</h1>

        <p>Fill all property details</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Title</label>

            <input
              type="text"
              placeholder="Luxury Villa"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Description</label>

            <input
              type="text"
              placeholder="4 BHK Villa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Price</label>

            <input
              type="number"
              placeholder="8500000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Location</label>

            <input
              type="text"
              placeholder="Lucknow"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Property Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          <button
            className="add-btn"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProperty;