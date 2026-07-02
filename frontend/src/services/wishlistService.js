import axios from "axios";

const API = "http://localhost:5000";

const getToken = () => {
  return localStorage.getItem("token");
};

export const addToWishlist = async (propertyId) => {
  return axios.post(
    `${API}/wishlist`,
    {
      property_id: propertyId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
};

export const getWishlist = async () => {
  return axios.get(`${API}/wishlist`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const removeFromWishlist = async (propertyId) => {
  return axios.delete(`${API}/wishlist/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};