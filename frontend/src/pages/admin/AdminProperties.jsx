import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

const statusColors = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  rented: "bg-blue-100 text-blue-700",
  sold: "bg-purple-100 text-purple-700",
};

export default function AdminProperties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const status = searchParams.get("status") || "";

  const load = () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    api.get("/admin/properties", { params }).then((res) => setProperties(res.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);

  const setStatusFilter = (s) => setSearchParams(s ? { status: s } : {});

  const updateStatus = async (id, newStatus) => {
    await api.put(`/admin/properties/${id}/status`, { status: newStatus });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this property?")) return;
    await api.delete(`/properties/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">All Properties</h2>
        <div className="flex gap-2">
          {["", "pending", "active", "rejected", "rented", "sold"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`badge capitalize ${status === s ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No properties found.</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p._id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link to={`/property/${p._id}`} className="hover:text-brand-600">{p.title}</Link>
                    <div className="text-xs text-gray-400">{p.address?.city}, {p.address?.state}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.owner?.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.propertyType} · {p.listingType}</td>
                  <td className="px-4 py-3 text-gray-600">₹{Number(p.price).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`badge capitalize ${statusColors[p.status] || "bg-gray-100 text-gray-700"}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {p.status === "pending" ? (
                        <>
                          <button onClick={() => updateStatus(p._id, "active")} className="btn-primary btn-sm">Approve</button>
                          <button onClick={() => updateStatus(p._id, "rejected")} className="btn-outline btn-sm text-red-600">Reject</button>
                        </>
                      ) : (
                        <button onClick={() => updateStatus(p._id, "pending")} className="btn-outline btn-sm text-amber-700 hover:bg-amber-50" title="Restore to pending for demo">Reset to Pending</button>
                      )}
                      <Link to={`/admin/properties/${p._id}/edit`} className="btn-outline btn-sm">Edit Rent/Details</Link>
                      <button onClick={() => handleDelete(p._id)} className="btn-danger btn-sm">Delete</button>
                    </div>
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
