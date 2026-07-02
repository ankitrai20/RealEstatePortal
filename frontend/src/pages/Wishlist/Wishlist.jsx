import { useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { useWishlist } from "../../context/WishlistContext";

function Wishlist() {

  const {
    wishlist,
    fetchWishlist,
  } = useWishlist();

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (

    <>

      <Navbar />

      <section className="max-w-7xl mx-auto py-12 px-6">

        <h1 className="text-4xl font-bold text-center mb-10">

          ❤️ My Wishlist

        </h1>

        {

          wishlist.length === 0 ? (

            <h2 className="text-center text-2xl text-gray-500">

              No Properties In Wishlist

            </h2>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              {

                wishlist.map((property) => (

                  <PropertyCard
                    key={property.id}
                    property={property}
                  />

                ))

              }

            </div>

          )

        }

      </section>

    </>

  );

}

export default Wishlist;