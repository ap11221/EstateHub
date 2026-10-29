import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";

const emptyForm = {
  title: "",
  description: "",
  propertyType: "Flat",
  listingType: "Rent",
  price: "",
  address: { street: "", city: "", state: "", pincode: "" },
  housingDetails: { bhk: 1, bathrooms: 1, areaSqft: "", floor: "", totalFloors: "", amenities: "" },
  rentalDetails: { deposit: "", leaseTermMonths: "", maintenanceCharges: "", furnishing: "Unfurnished" },
};

export default function AddProperty() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing
  const isEdit = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/properties/${id}`).then((res) => {
        const p = res.data;
        setForm({
          title: p.title,
          description: p.description,
          propertyType: p.propertyType,
          listingType: p.listingType,
          price: p.price,
          address: p.address,
          housingDetails: { ...p.housingDetails, amenities: (p.housingDetails.amenities || []).join(", ") },
          rentalDetails: {
            deposit: p.rentalDetails?.deposit || "",
            leaseTermMonths: p.rentalDetails?.leaseTermMonths || "",
            maintenanceCharges: p.rentalDetails?.maintenanceCharges || "",
            furnishing: p.rentalDetails?.furnishing || "Unfurnished",
          },
        });
        setExistingImages(p.images || []);
      });
    }
  }, [id, isEdit]);

  const update = (section, key, value) => {
    if (section) setForm((f) => ({ ...f, [section]: { ...f[section], [key]: value } }));
    else setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("propertyType", form.propertyType);
      fd.append("listingType", form.listingType);
      fd.append("price", form.price);
      fd.append("address", JSON.stringify(form.address));
      fd.append(
        "housingDetails",
        JSON.stringify({
          ...form.housingDetails,
          amenities: form.housingDetails.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        })
      );
      fd.append("rentalDetails", JSON.stringify(form.rentalDetails));
      images.forEach((img) => fd.append("images", img));

      if (isEdit) {
        await api.put(`/properties/${id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/properties", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      navigate("/my-properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{isEdit ? "Edit Property" : "List a New Property"}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {isEdit ? "Editing an active listing will send it back for admin approval." : "New listings are reviewed by an admin before going live."}
      </p>

      {error && <div className="mb-4 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Basic Info</h2>
          <div className="space-y-3">
            <div>
              <label className="label">Title</label>
              <input required className="input" value={form.title} onChange={(e) => update(null, "title", e.target.value)} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea required rows={4} className="input" value={form.description} onChange={(e) => update(null, "description", e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Property Type</label>
                <select className="input" value={form.propertyType} onChange={(e) => update(null, "propertyType", e.target.value)}>
                  {["Flat", "Apartment", "Bungalow", "House", "Villa", "Plot"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Listing Type</label>
                <select className="input" value={form.listingType} onChange={(e) => update(null, "listingType", e.target.value)}>
                  <option value="Rent">For Rent</option>
                  <option value="Sale">For Sale</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">{form.listingType === "Rent" ? "Monthly Rent (₹)" : "Sale Price (₹)"}</label>
              <input required type="number" min="0" className="input" value={form.price} onChange={(e) => update(null, "price", e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-3">Address</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Street" className="input col-span-2" value={form.address.street} onChange={(e) => update("address", "street", e.target.value)} />
            <input required placeholder="City" className="input" value={form.address.city} onChange={(e) => update("address", "city", e.target.value)} />
            <input required placeholder="State" className="input" value={form.address.state} onChange={(e) => update("address", "state", e.target.value)} />
            <input placeholder="Pincode" className="input" value={form.address.pincode} onChange={(e) => update("address", "pincode", e.target.value)} />
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-3">Housing Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div><label className="label">BHK</label><input type="number" min="1" className="input" value={form.housingDetails.bhk} onChange={(e) => update("housingDetails", "bhk", e.target.value)} /></div>
            <div><label className="label">Bathrooms</label><input type="number" min="1" className="input" value={form.housingDetails.bathrooms} onChange={(e) => update("housingDetails", "bathrooms", e.target.value)} /></div>
            <div><label className="label">Area (sqft)</label><input required type="number" min="0" className="input" value={form.housingDetails.areaSqft} onChange={(e) => update("housingDetails", "areaSqft", e.target.value)} /></div>
            <div><label className="label">Floor</label><input className="input" value={form.housingDetails.floor} onChange={(e) => update("housingDetails", "floor", e.target.value)} /></div>
            <div><label className="label">Total Floors</label><input type="number" min="0" className="input" value={form.housingDetails.totalFloors} onChange={(e) => update("housingDetails", "totalFloors", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-3"><label className="label">Amenities (comma separated)</label><input placeholder="Lift, Parking, Gym" className="input" value={form.housingDetails.amenities} onChange={(e) => update("housingDetails", "amenities", e.target.value)} /></div>
          </div>
        </div>

        {form.listingType === "Rent" && (
          <div>
            <h2 className="font-bold text-gray-900 mb-3">Rental Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Deposit (₹)</label><input type="number" min="0" className="input" value={form.rentalDetails.deposit} onChange={(e) => update("rentalDetails", "deposit", e.target.value)} /></div>
              <div><label className="label">Lease Term (months)</label><input type="number" min="0" className="input" value={form.rentalDetails.leaseTermMonths} onChange={(e) => update("rentalDetails", "leaseTermMonths", e.target.value)} /></div>
              <div><label className="label">Maintenance (₹/mo)</label><input type="number" min="0" className="input" value={form.rentalDetails.maintenanceCharges} onChange={(e) => update("rentalDetails", "maintenanceCharges", e.target.value)} /></div>
              <div>
                <label className="label">Furnishing</label>
                <select className="input" value={form.rentalDetails.furnishing} onChange={(e) => update("rentalDetails", "furnishing", e.target.value)}>
                  <option>Unfurnished</option>
                  <option>Semi-Furnished</option>
                  <option>Fully-Furnished</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-bold text-gray-900 mb-3">Photos</h2>
          {existingImages.length > 0 && (
            <div className="flex gap-2 mb-3 flex-wrap">
              {existingImages.map((img, i) => <img key={i} src={img} className="w-20 h-16 object-cover rounded-lg" />)}
            </div>
          )}
          <input type="file" multiple accept="image/*" className="input" onChange={(e) => setImages(Array.from(e.target.files))} />
          <p className="text-xs text-gray-400 mt-1">Up to 8 images (jpg, png, webp).</p>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Saving..." : isEdit ? "Update Property" : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}
