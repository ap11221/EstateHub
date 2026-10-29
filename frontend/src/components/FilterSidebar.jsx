export default function FilterSidebar({ filters, setFilters, onApply, onReset }) {
  const handleChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="card p-5 space-y-5 sticky top-20">
      <h3 className="font-bold text-gray-900 text-lg">Filters</h3>

      <div>
        <label className="label">Keyword</label>
        <input
          className="input"
          placeholder="Title, city..."
          value={filters.keyword || ""}
          onChange={(e) => handleChange("keyword", e.target.value)}
        />
      </div>

      <div>
        <label className="label">City</label>
        <input
          className="input"
          placeholder="e.g. Agra"
          value={filters.city || ""}
          onChange={(e) => handleChange("city", e.target.value)}
        />
      </div>

      <div>
        <label className="label">Listing Type</label>
        <select className="input" value={filters.listingType || ""} onChange={(e) => handleChange("listingType", e.target.value)}>
          <option value="">Any</option>
          <option value="Rent">For Rent</option>
          <option value="Sale">For Sale</option>
        </select>
      </div>

      <div>
        <label className="label">Property Type</label>
        <select className="input" value={filters.propertyType || ""} onChange={(e) => handleChange("propertyType", e.target.value)}>
          <option value="">Any</option>
          <option value="Flat">Flat</option>
          <option value="Apartment">Apartment</option>
          <option value="Bungalow">Bungalow</option>
          <option value="House">House</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
        </select>
      </div>

      <div>
        <label className="label">BHK</label>
        <select className="input" value={filters.bhk || ""} onChange={(e) => handleChange("bhk", e.target.value)}>
          <option value="">Any</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n} BHK</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="label">Min Price</label>
          <input type="number" className="input" placeholder="0" value={filters.minPrice || ""} onChange={(e) => handleChange("minPrice", e.target.value)} />
        </div>
        <div>
          <label className="label">Max Price</label>
          <input type="number" className="input" placeholder="Any" value={filters.maxPrice || ""} onChange={(e) => handleChange("maxPrice", e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={onApply} className="btn-primary btn-sm flex-1">Apply</button>
        <button onClick={onReset} className="btn-outline btn-sm flex-1">Reset</button>
      </div>
    </div>
  );
}
