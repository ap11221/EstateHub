import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PropertyCard from "../components/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";
import { useAuth } from "../context/AuthContext";

export default function Listings() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [favIds, setFavIds] = useState([]);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    city: searchParams.get("city") || "",
    listingType: searchParams.get("listingType") || "",
    propertyType: searchParams.get("propertyType") || "",
    bhk: searchParams.get("bhk") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const fetchProperties = useCallback((filtersToUse, pageToUse) => {
    setLoading(true);
    const params = { ...filtersToUse, page: pageToUse, limit: 9 };
    Object.keys(params).forEach((k) => !params[k] && delete params[k]);
    api.get("/properties", { params })
      .then((res) => {
        setProperties(res.data.properties);
        setPages(res.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProperties(filters, page);
  }, [page]);

  useEffect(() => {
    if (user) {
      api.get("/favorites").then((res) => setFavIds(res.data.map((f) => f.property._id))).catch(() => {});
    }
  }, [user]);

  const applyFilters = () => {
    setPage(1);
    const params = {};
    Object.keys(filters).forEach((k) => filters[k] && (params[k] = filters[k]));
    setSearchParams(params);
    fetchProperties(filters, 1);
  };

  const resetFilters = () => {
    const empty = { keyword: "", city: "", listingType: "", propertyType: "", bhk: "", minPrice: "", maxPrice: "" };
    setFilters(empty);
    setSearchParams({});
    setPage(1);
    fetchProperties(empty, 1);
  };

  const toggleFavorite = async (propertyId) => {
    if (!user) return;
    try {
      if (favIds.includes(propertyId)) {
        await api.delete(`/favorites/${propertyId}`);
        setFavIds(favIds.filter((id) => id !== propertyId));
      } else {
        await api.post(`/favorites/${propertyId}`);
        setFavIds([...favIds, propertyId]);
      }
    } catch (err) {}
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Browse Properties</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterSidebar filters={filters} setFilters={setFilters} onApply={applyFilters} onReset={resetFilters} />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading properties...</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No properties match your filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} isFavorite={favIds.includes(p._id)} onToggleFavorite={toggleFavorite} />
                ))}
              </div>

              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold ${page === n ? "bg-brand-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
