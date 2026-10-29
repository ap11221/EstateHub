import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const formatPrice = (price, listingType) => {
  const n = Number(price);
  let display;
  if (n >= 10000000) display = `₹${(n / 10000000).toFixed(2)} Cr`;
  else if (n >= 100000) display = `₹${(n / 100000).toFixed(2)} L`;
  else display = `₹${n.toLocaleString("en-IN")}`;
  return listingType === "Rent" ? `${display}/mo` : display;
};

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  rented: "bg-blue-100 text-blue-700",
  sold: "bg-purple-100 text-purple-700",
};

export default function PropertyCard({ property, isFavorite, onToggleFavorite, showStatus }) {
  const { user } = useAuth();
  const img = property.images && property.images.length > 0 ? property.images[0] : null;

  return (
    <div className="card overflow-hidden group hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {img ? (
          <img src={img} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-500">
            <svg width="56" height="56" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        )}
        <span className="absolute top-3 left-3 badge bg-white/90 text-brand-700 shadow">{property.listingType === "Rent" ? "For Rent" : "For Sale"}</span>
        {showStatus && property.status && (
          <span className={`absolute top-3 right-3 badge capitalize ${statusColors[property.status] || "bg-gray-100 text-gray-700"}`}>
            {property.status}
          </span>
        )}
        {user && onToggleFavorite && !showStatus && (
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(property._id); }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition"
            aria-label="Toggle favorite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "#dc2626" : "none"} stroke={isFavorite ? "#dc2626" : "#6b7280"} strokeWidth="2">
              <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">{property.title}</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {property.address?.city}, {property.address?.state}
        </p>

        <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">🛏 {property.housingDetails?.bhk} BHK</span>
          <span className="flex items-center gap-1">🛁 {property.housingDetails?.bathrooms}</span>
          <span className="flex items-center gap-1">📐 {property.housingDetails?.areaSqft} sqft</span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-lg font-extrabold text-brand-700">{formatPrice(property.price, property.listingType)}</span>
          <Link to={`/property/${property._id}`} className="btn-outline btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
}
