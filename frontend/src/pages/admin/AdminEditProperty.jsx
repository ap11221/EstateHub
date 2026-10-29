import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [price, setPrice] = useState("");
  const [rental, setRental] = useState({ deposit: "", leaseTermMonths: "", maintenanceCharges: "", furnishing: "Unfurnished" });
  const [housing, setHousing] = useState({ bhk: "", bathrooms: "", areaSqft: "", floor: "", totalFloors: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => {
      const p = res.data;
      setProperty(p);
      setPrice(p.price);
      setRental({
        deposit: p.rentalDetails?.deposit || 0,
        leaseTermMonths: p.rentalDetails?.leaseTermMonths || 0,
        maintenanceCharges: p.rentalDetails?.maintenanceCharges || 0,
        furnishing: p.rentalDetails?.furnishing || "Unfurnished",
      });
      setHousing({
        bhk: p.housingDetails?.bhk || 1,
        bathrooms: p.housingDetails?.bathrooms || 1,
        areaSqft: p.housingDetails?.areaSqft || 0,
        floor: p.housingDetails?.floor || "",
        totalFloors: p.housingDetails?.totalFloors || 0,
      });
    });
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const { data } = await api.put(`/admin/properties/${id}/details`, {
        price: Number(price),
        rentalDetails: {
          ...rental,
          deposit: Number(rental.deposit),
          leaseTermMonths: Number(rental.leaseTermMonths),
          maintenanceCharges: Number(rental.maintenanceCharges),
        },
        housingDetails: {
          ...housing,
          bhk: Number(housing.bhk),
          bathrooms: Number(housing.bathrooms),
          areaSqft: Number(housing.areaSqft),
          totalFloors: Number(housing.totalFloors),
        },
      });
      setProperty(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!property) return <div className="text-center py-16 text-gray-400">Loading...</div>;

  return (
    <div>
      <Link to="/admin/properties" className="text-sm text-brand-600 font-semibold hover:underline">← Back to properties</Link>

      <h2 className="text-xl font-bold text-gray-900 mt-3 mb-1">{property.title}</h2>
      <p className="text-sm text-gray-500 mb-6">
        Admin override: update rent/price, rental details and housing details for this listing directly.
      </p>

      {saved && <div className="mb-4 bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg">✓ Changes saved successfully.</div>}

      <form onSubmit={handleSave} className="card p-6 space-y-6">
        <div>
          <h3 className="font-bold text-gray-900 mb-3">Price / Rent</h3>
          <label className="label">{property.listingType === "Rent" ? "Monthly Rent (₹)" : "Sale Price (₹)"}</label>
          <input type="number" min="0" className="input max-w-xs" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <h3 className="font-bold text-gray-900 mb-3">Housing Details</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className="label">BHK</label><input type="number" min="1" className="input" value={housing.bhk} onChange={(e) => setHousing({ ...housing, bhk: e.target.value })} /></div>
            <div><label className="label">Bathrooms</label><input type="number" min="1" className="input" value={housing.bathrooms} onChange={(e) => setHousing({ ...housing, bathrooms: e.target.value })} /></div>
            <div><label className="label">Area (sqft)</label><input type="number" min="0" className="input" value={housing.areaSqft} onChange={(e) => setHousing({ ...housing, areaSqft: e.target.value })} /></div>
            <div><label className="label">Floor</label><input className="input" value={housing.floor} onChange={(e) => setHousing({ ...housing, floor: e.target.value })} /></div>
            <div><label className="label">Total Floors</label><input type="number" min="0" className="input" value={housing.totalFloors} onChange={(e) => setHousing({ ...housing, totalFloors: e.target.value })} /></div>
          </div>
        </div>

        {property.listingType === "Rent" && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Rental Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Deposit (₹)</label><input type="number" min="0" className="input" value={rental.deposit} onChange={(e) => setRental({ ...rental, deposit: e.target.value })} /></div>
              <div><label className="label">Lease Term (months)</label><input type="number" min="0" className="input" value={rental.leaseTermMonths} onChange={(e) => setRental({ ...rental, leaseTermMonths: e.target.value })} /></div>
              <div><label className="label">Maintenance (₹/mo)</label><input type="number" min="0" className="input" value={rental.maintenanceCharges} onChange={(e) => setRental({ ...rental, maintenanceCharges: e.target.value })} /></div>
              <div>
                <label className="label">Furnishing</label>
                <select className="input" value={rental.furnishing} onChange={(e) => setRental({ ...rental, furnishing: e.target.value })}>
                  <option>Unfurnished</option>
                  <option>Semi-Furnished</option>
                  <option>Fully-Furnished</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={saving} className="btn-primary w-full sm:w-auto">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
