import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);

  // ================= LOAD WISHLIST =================

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      const res = await getWishlist();
      setWishlist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // ================= TOGGLE WISHLIST =================

  const toggleWishlist = async (property) => {
    const exists = wishlist.find(
      (item) => item.id === property.id
    );

    try {
      if (exists) {
        await removeFromWishlist(property.id);

        setWishlist(
          wishlist.filter(
            (item) => item.id !== property.id
          )
        );
      } else {
        await addToWishlist(property.id);

        setWishlist([
          ...wishlist,
          property,
        ]);
      }
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
          "Wishlist Error"
      );
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}