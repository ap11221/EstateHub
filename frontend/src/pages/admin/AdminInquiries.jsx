import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/inquiries").then((res) => setInquiries(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">All Inquiries</h2>
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No inquiries yet.</div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq._id} className="card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{inq.name} <span className="text-gray-400 font-normal">· {inq.email}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    On: <Link to={`/property/${inq.property?._id}`} className="text-brand-600 hover:underline">{inq.property?.title}</Link>
                  </p>
                </div>
                <span className="badge bg-gray-100 text-gray-600 capitalize">{inq.status}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{inq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
