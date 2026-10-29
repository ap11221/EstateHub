import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data)).catch(() => {});
  }, []);

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
