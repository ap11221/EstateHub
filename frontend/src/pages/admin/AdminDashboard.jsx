import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [resetting, setResetting] = useState(false);

  const fetchStats = () => {
    api.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleResetData = async () => {
    if (!confirm("Are you sure you want to reset all demo properties, accounts, and inquiries back to original state?")) return;
    setResetting(true);
    try {
      await api.post("/admin/reset-demo-data");
      fetchStats();
      alert("All demo listings and accounts have been reset to their original state!");
    } catch (err) {
      alert("Failed to reset: " + (err.response?.data?.message || err.message));
    } finally {
      setResetting(false);
    }
  };

  if (!stats) return <div className="text-center py-20 text-gray-400">Loading stats...</div>;

  const cards = [
    { label: "Total Properties", value: stats.totalProperties, color: "bg-brand-50 text-brand-700" },
    { label: "Active Listings", value: stats.activeProperties, color: "bg-green-50 text-green-700" },
    { label: "Pending Approval", value: stats.pendingProperties, color: "bg-yellow-50 text-yellow-700", link: "/admin/properties?status=pending" },
    { label: "Total Users", value: stats.totalUsers, color: "bg-blue-50 text-blue-700" },
    { label: "Property Owners", value: stats.totalOwners, color: "bg-purple-50 text-purple-700" },
    { label: "Total Inquiries", value: stats.totalInquiries, color: "bg-pink-50 text-pink-700" },
    { label: "For Rent", value: stats.rentCount, color: "bg-indigo-50 text-indigo-700" },
    { label: "For Sale", value: stats.saleCount, color: "bg-teal-50 text-teal-700" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">Platform Analytics</h2>
          <p className="text-xs text-gray-500">Live operational overview across all users and listings.</p>
        </div>
        <button
          onClick={handleResetData}
          disabled={resetting}
          className="btn-outline text-xs px-3 py-1.5 border-dashed border-gray-300 text-gray-600 hover:text-brand-700 hover:border-brand-600 flex items-center gap-1.5"
          title="Restore all sample properties and users back to original demo state"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {resetting ? "Resetting..." : "Reset Demo Data"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.link || "/admin/properties"} className={`card p-5 ${c.color} hover:shadow-md transition`}>
            <div className="text-3xl font-extrabold">{c.value}</div>
            <div className="text-sm font-medium mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      {stats.pendingProperties > 0 && (
        <div className="mt-6 card p-5 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            You have <strong>{stats.pendingProperties}</strong> listing(s) awaiting approval.{" "}
            <Link to="/admin/properties?status=pending" className="underline font-semibold">Review now →</Link>
          </p>
        </div>
      )}
    </div>
  );
}
