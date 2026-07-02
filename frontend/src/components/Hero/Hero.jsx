import SearchBar from "../SearchBar/SearchBar";

function Hero({ onSearch, onSort }) {
  return (
    <section className="bg-blue-600 text-white min-h-[90vh] flex items-center justify-center">

      <div className="max-w-5xl mx-auto text-center px-6">

        <h1 className="text-6xl font-bold leading-tight">
          Find Your Dream Home
        </h1>

        <p className="mt-5 text-xl">
          Buy • Rent • Sell Properties Easily
        </p>

        <button
          className="mt-8 bg-white text-blue-600 px-8 py-3 rounded-lg font-bold shadow hover:bg-gray-100 transition"
        >
          Explore Properties
        </button>

        <div className="mt-10">
          <SearchBar
            onSearch={onSearch}
            onSort={onSort}
          />
        </div>

      </div>

    </section>
  );
}

export default Hero;