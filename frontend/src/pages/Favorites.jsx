import { useEffect, useState } from "react";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/favorites").then((res) => setFavorites(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleFavorite = async (propertyId) => {
    await api.delete(`/favorites/${propertyId}`);
    setFavorites(favorites.filter((f) => f.property._id !== propertyId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Favorite Properties</h1>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 text-gray-400">You haven't saved any properties yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((f) => (
            <PropertyCard key={f._id} property={f.property} isFavorite={true} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      )}
    </div>
  );
}
