import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  rented: "bg-blue-100 text-blue-700",
  sold: "bg-purple-100 text-purple-700",
};

export default function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/properties/mine/list").then((res) => setProperties(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    await api.delete(`/properties/${id}`);
    setProperties(properties.filter((p) => p._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Properties</h1>
        <Link to="/my-properties/add" className="btn-primary">+ Add Property</Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-gray-400">You haven't listed any properties yet.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link to={`/property/${p._id}`} className="hover:text-brand-600">{p.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.propertyType} · {p.listingType}</td>
                  <td className="px-4 py-3 text-gray-600">₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${statusColors[p.status] || "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.views}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Link to={`/my-properties/edit/${p._id}`} className="btn-outline btn-sm">Edit</Link>
                    <button onClick={() => handleDelete(p._id)} className="btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
