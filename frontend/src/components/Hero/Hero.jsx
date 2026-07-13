import SearchBar from "../SearchBar/SearchBar";

function Hero({ onSearch, onSort }) {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">

        <span className="inline-block bg-white/20 backdrop-blur-md px-5 py-2 rounded-full text-sm tracking-wide mb-6">
          🏡 India's Trusted Real Estate Platform
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-white">
          Find Your
          <span className="text-blue-300"> Dream Home</span>
        </h1>

        <p className="mt-6 text-xl text-gray-200">
          Buy • Rent • Sell Properties Easily
        </p>

        <button className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-lg font-semibold shadow-xl">
          Explore Properties
        </button>

        <div className="mt-12 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
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