import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const formatPrice = (price, listingType) => {
  const n = Number(price);
  let display;
  if (n >= 10000000) display = `₹${(n / 10000000).toFixed(2)} Cr`;
  else if (n >= 100000) display = `₹${(n / 100000).toFixed(2)} L`;
  else display = `₹${n.toLocaleString("en-IN")}`;
  return listingType === "Rent" ? `${display}/mo` : display;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactStatus, setContactStatus] = useState("");
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => setProperty(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user) {
      api.get("/favorites").then((res) => setIsFav(res.data.some((f) => f.property._id === id))).catch(() => {});
      setContactForm((f) => ({ ...f, name: user.name, email: user.email }));
    }
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user) return navigate("/login", { state: { from: `/property/${id}` } });
    if (isFav) {
      await api.delete(`/favorites/${id}`);
      setIsFav(false);
    } else {
      await api.post(`/favorites/${id}`);
      setIsFav(true);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login", { state: { from: `/property/${id}` } });
    setContactStatus("sending");
    try {
      await api.post(`/inquiries/${id}`, contactForm);
      setContactStatus("sent");
    } catch (err) {
      setContactStatus("error");
    }
  };

  if (loading) return <div className="text-center py-24 text-gray-400">Loading...</div>;
  if (!property) return <div className="text-center py-24 text-gray-400">Property not found.</div>;

  const { housingDetails: h = {}, rentalDetails: r = {}, address = {} } = property;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/listings" className="text-sm text-brand-600 font-semibold hover:underline">← Back to listings</Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="card overflow-hidden">
            <div className="h-96 bg-gray-100 relative">
              {property.images && property.images.length > 0 ? (
                <img src={property.images[activeImg]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200 text-brand-400 text-6xl">🏠</div>
              )}
              <span className="absolute top-4 left-4 badge bg-white/90 text-brand-700 shadow">{property.listingType === "Rent" ? "For Rent" : "For Sale"}</span>
            </div>
            {property.images && property.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} className={`w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${activeImg === i ? "border-brand-600" : "border-transparent"}`}>
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{property.title}</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1">
                  📍 {address.street ? `${address.street}, ` : ""}{address.city}, {address.state} {address.pincode}
                </p>
              </div>
              <button onClick={toggleFavorite} className="btn-outline btn-sm shrink-0">
                {isFav ? "♥ Saved" : "♡ Save"}
              </button>
            </div>

            <div className="text-3xl font-extrabold text-brand-700 mt-4">{formatPrice(property.price, property.listingType)}</div>

            {/* Housing details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {[
                ["BHK", h.bhk],
                ["Bathrooms", h.bathrooms],
                ["Area", `${h.areaSqft} sqft`],
                ["Floor", h.floor || "N/A"],
              ].map(([label, val]) => (
                <div key={label} className="card p-4 text-center">
                  <div className="text-lg font-bold text-gray-900">{val}</div>
                  <div className="text-xs text-gray-500 mt-1">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {h.amenities && h.amenities.length > 0 && (
              <div className="mt-6">
                <h2 className="font-bold text-gray-900 mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {h.amenities.map((a) => (
                    <span key={a} className="badge bg-brand-50 text-brand-700">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {property.listingType === "Rent" && (
              <div className="mt-6">
                <h2 className="font-bold text-gray-900 mb-2">Rental Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    ["Deposit", `₹${(r.deposit || 0).toLocaleString("en-IN")}`],
                    ["Lease Term", `${r.leaseTermMonths || 0} months`],
                    ["Maintenance", `₹${(r.maintenanceCharges || 0).toLocaleString("en-IN")}/mo`],
                    ["Furnishing", r.furnishing || "N/A"],
                  ].map(([label, val]) => (
                    <div key={label} className="card p-4 text-center">
                      <div className="text-sm font-bold text-gray-900">{val}</div>
                      <div className="text-xs text-gray-500 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact owner sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-1">Contact Owner</h3>
            <p className="text-sm text-gray-500 mb-4">{property.owner?.name}</p>

            {contactStatus === "sent" ? (
              <div className="bg-green-50 text-green-700 text-sm px-3 py-3 rounded-lg">
                ✓ Your message has been sent to the owner. They'll reach out to you soon.
              </div>
            ) : !showContact ? (
              <button onClick={() => setShowContact(true)} className="btn-primary w-full">Send Inquiry</button>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3">
                <input required placeholder="Your name" className="input" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} />
                <input required type="email" placeholder="Your email" className="input" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />
                <input placeholder="Your phone (optional)" className="input" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} />
                <textarea required rows={4} placeholder="I'm interested in this property..." className="input" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />
                {contactStatus === "error" && <div className="text-red-600 text-xs">Something went wrong. Please try again.</div>}
                <button type="submit" disabled={contactStatus === "sending"} className="btn-primary w-full">
                  {contactStatus === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

            {!user && <p className="text-xs text-gray-400 mt-3 text-center">You'll need to log in to contact the owner.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
