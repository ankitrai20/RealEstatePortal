import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProperty.css";

function AddProperty() {

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");

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

      const response = await fetch(
        "http://localhost:5000/property",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title,
            description,
            price,
            location,
            image,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Property Added Successfully!");

        navigate("/");

      } else {

        alert(data.message || data.error);

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
              onChange={(e)=>setTitle(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Description</label>

            <input
              type="text"
              placeholder="4 BHK Villa"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Price</label>

            <input
              type="number"
              placeholder="8500000"
              value={price}
              onChange={(e)=>setPrice(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Location</label>

            <input
              type="text"
              placeholder="Lucknow"
              value={location}
              onChange={(e)=>setLocation(e.target.value)}
            />

          </div>

          <div className="input-group">

            <label>Image URL / Image Name</label>

            <input
              type="text"
              placeholder="villa.jpg"
              value={image}
              onChange={(e)=>setImage(e.target.value)}
            />

          </div>

          <button
            className="add-btn"
            disabled={loading}
          >

            {loading ? "Adding..." : "Add Property"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddProperty;