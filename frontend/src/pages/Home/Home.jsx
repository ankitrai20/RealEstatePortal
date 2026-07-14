import { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const API = import.meta.env.VITE_API_URL;

function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // ================= FETCH DATA =================

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API}/properties`);

      setProperties(res.data);
      setFilteredProperties(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= SEARCH =================

  const handleSearch = (location, type) => {
    const filtered = properties.filter((property) => {
      const matchLocation = property.location
        .toLowerCase()
        .includes(location.toLowerCase());

      const matchType =
        type === "All" ||
        property.title
          .toLowerCase()
          .includes(type.toLowerCase());

      return matchLocation && matchType;
    });

    setFilteredProperties(filtered);
  };

  // ================= SORT =================

  const handleSort = (value) => {
    let sorted = [...filteredProperties];

    if (value === "low") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (value === "high") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      sorted = [...properties];
    }

    setFilteredProperties(sorted);
  };

  return (
    <>
      <Navbar />

      <Hero
        onSearch={handleSearch}
        onSort={handleSort}
      />

      <section className="py-16 bg-gray-100">
        <h1 className="text-3xl text-red-600 text-center mb-5">
          Total Properties : {filteredProperties.length}
        </h1>

        <h2 className="text-4xl font-bold text-center mb-10">
          Featured Properties
        </h2>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default Home;