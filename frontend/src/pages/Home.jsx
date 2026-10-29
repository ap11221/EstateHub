import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/properties?limit=6&sort=-createdAt")
      .then((res) => setProperties(res.data.properties))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/listings${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Find your next home, faster.</h1>
          <p className="mt-4 text-brand-100 text-lg max-w-2xl mx-auto">
            Browse flats, bungalows, houses & villas for sale or rent — filter by city, budget and BHK.
          </p>

          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex bg-white rounded-xl shadow-lg overflow-hidden">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by city, locality or property title..."
              className="flex-1 px-4 py-3 text-gray-800 outline-none"
            />
            <button type="submit" className="bg-brand-800 hover:bg-brand-900 text-white px-6 font-semibold transition">
              Search
            </button>
          </form>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link to="/listings?listingType=Rent" className="badge bg-white/15 hover:bg-white/25 transition text-white">For Rent</Link>
            <Link to="/listings?listingType=Sale" className="badge bg-white/15 hover:bg-white/25 transition text-white">For Sale</Link>
            <Link to="/listings?propertyType=Bungalow" className="badge bg-white/15 hover:bg-white/25 transition text-white">Bungalows</Link>
            <Link to="/listings?propertyType=Villa" className="badge bg-white/15 hover:bg-white/25 transition text-white">Villas</Link>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Properties</h2>
          <Link to="/listings" className="text-brand-600 font-semibold text-sm hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No properties yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { icon: "🏠", title: "Verified Listings", desc: "Every listing is reviewed by our admin team before going live." },
            { icon: "🔍", title: "Powerful Filters", desc: "Narrow down by city, price, BHK and property type instantly." },
            { icon: "💬", title: "Direct Contact", desc: "Message property owners directly — no middlemen." },
          ].map((f) => (
            <div key={f.title}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
