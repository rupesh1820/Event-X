import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";
const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("eventxToken") || ""}`,
  },
});

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: [],
    events: [],
    bookings: [],
    inquiries: [],
    stats: {},
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/admin/overview`,
        authConfig(),
      );
      setData(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("eventxToken");
        localStorage.removeItem("eventxUser");
        navigate("/login", { replace: true });
        return;
      }
      setMessage(error.response?.data?.message || "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API_URL}/api/admin/overview`, authConfig())
      .then((response) => {
        if (isMounted) setData(response.data);
      })
      .catch((error) => {
        if (isMounted)
          setMessage(
            error.response?.data?.message || "Unable to load admin data",
          );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const updateEvent = async (eventId, status) => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/events/${eventId}/status`,
        { status },
        authConfig(),
      );
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update event");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user, their bookings, and creator data?"))
      return;
    try {
      await axios.delete(`${API_URL}/api/admin/users/${userId}`, authConfig());
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete user");
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Delete this event and its bookings?")) return;
    try {
      await axios.delete(
        `${API_URL}/api/admin/events/${eventId}`,
        authConfig(),
      );
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to delete event");
    }
  };

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/users/${userId}/role`,
        { role },
        authConfig(),
      );
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update user role");
    }
  };

  const exportReport = () => {
    const report = [
      "EVENTX ADMIN REPORT",
      `Users: ${data.stats?.users || 0}`,
      `Creators: ${data.stats?.creators || 0}`,
      `Approved events: ${data.stats?.events || 0}`,
      `Revenue: Rs. ${data.stats?.revenue || 0}`,
      `Bookings: ${data.bookings.length}`,
      `Open inquiries: ${(data.inquiries || []).filter((inquiry) => inquiry.status !== "resolved").length}`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventx-admin-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const resolveInquiry = async (inquiryId) => {
    try {
      await axios.patch(
        `${API_URL}/api/admin/inquiries/${inquiryId}/status`,
        { status: "resolved" },
        authConfig(),
      );
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update inquiry");
    }
  };

  const stats = data.stats || {};
  const filteredUsers = data.users.filter((user) =>
    userFilter === "all" ? true : (user.role || "user") === userFilter,
  );
  const cards = [
    ["Total Users", stats.users || 0, "bg-violet-600"],
    ["Active Creators", stats.creators || 0, "bg-cyan-600"],
    ["Approved Events", stats.events || 0, "bg-emerald-600"],
    [
      "Revenue",
      `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`,
      "bg-pink-600",
    ],
  ];

  return (
    <DashboardLayout admin title="Admin Panel">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Admin Control Center
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Manage users, creators, events, and bookings.
            </p>
          </div>
          <button
            type="button"
            onClick={exportReport}
            className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm text-violet-300 hover:bg-violet-500/10"
          >
            ↓ Export Report
          </button>
        </div>
        {message && <p className="text-sm text-red-300">{message}</p>}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#10131d] p-4"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
              >
                ◇
              </div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-1 text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section
            id="reports"
            className="rounded-2xl border border-white/10 bg-[#10131d] p-5"
          >
            <h3 className="mb-4 text-lg font-semibold">Event Approvals</h3>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500">Loading events...</p>
              ) : (
                data.events.map((event) => (
                  <div
                    key={event._id}
                    className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {event.hostName} · {event.approvalStatus || "approved"}
                      </p>
                    </div>
                    {event.approvalStatus === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => updateEvent(event._id, "approved")}
                          className="text-xs text-emerald-300"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateEvent(event._id, "rejected")}
                          className="text-xs text-amber-300"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => deleteEvent(event._id)}
                      className="text-xs text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
          <section
            id="users"
            className="rounded-2xl border border-white/10 bg-[#10131d] p-5"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">Users & Creators</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUserFilter("all")}
                  className={`rounded px-2 py-1 text-xs ${userFilter === "all" ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400"}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter("user")}
                  className={`rounded px-2 py-1 text-xs ${userFilter === "user" ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400"}`}
                >
                  Users
                </button>
                <button
                  type="button"
                  onClick={() => setUserFilter("creator")}
                  className={`rounded px-2 py-1 text-xs ${userFilter === "creator" ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400"}`}
                >
                  Creators
                </button>
              </div>
            </div>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{user.fullName}</p>
                    <p className="truncate text-xs text-gray-500">
                      {user.emailAddress}
                    </p>
                  </div>
                  <select
                    value={user.role || "user"}
                    onChange={(event) =>
                      updateRole(user._id, event.target.value)
                    }
                    className="rounded bg-[#171b29] px-2 py-1 text-xs"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteUser(user._id)}
                    className="text-xs text-red-300"
                  >
                    Delete
                  </button>
                </div>
              ))}
              {!filteredUsers.length && (
                <p className="text-sm text-gray-500">No matching accounts.</p>
              )}
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
          <h3 className="mb-4 text-lg font-semibold">Booking Control</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {data.bookings.slice(0, 12).map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl border border-white/10 p-3"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium">{booking.eventName}</p>
                    <p className="text-xs text-gray-500">
                      {booking.fullName} · {booking.quantity} ticket(s) · ₹
                      {booking.total}
                    </p>
                  </div>
                  <span className="text-xs capitalize text-violet-300">
                    {booking.status}
                  </span>
                </div>
                {booking.status === "confirmed" && (
                  <button
                    type="button"
                    onClick={async () => {
                      await axios.patch(
                        `${API_URL}/api/admin/bookings/${booking._id}/status`,
                        { status: "cancelled" },
                        authConfig(),
                      );
                      loadData();
                    }}
                    className="mt-2 text-xs text-red-300"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
          <h3 className="mb-4 text-lg font-semibold">Contact Inquiries</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {data.inquiries?.length ? (
              data.inquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  className="rounded-xl border border-white/10 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{inquiry.subject}</p>
                      <p className="text-xs text-gray-400">
                        {inquiry.name} · {inquiry.email}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] capitalize ${inquiry.status === "resolved" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}
                    >
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-300">
                    {inquiry.message}
                  </p>
                  {inquiry.status !== "resolved" && (
                    <button
                      type="button"
                      onClick={() => resolveInquiry(inquiry._id)}
                      className="mt-3 text-xs text-emerald-300"
                    >
                      Mark resolved
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No inquiries yet.</p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
