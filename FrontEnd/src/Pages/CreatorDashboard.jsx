import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";
 const API_URL = import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";
// const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("eventxToken") || ""}` },
});

const CreatorDashboard = () => {
  const [data, setData] = useState({ events: [], bookings: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/creator/overview`, authConfig());
      setData(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load creator data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    axios.get(`${API_URL}/api/creator/overview`, authConfig())
      .then((response) => {
        if (isMounted) setData(response.data);
      })
      .catch((error) => {
        if (isMounted) setMessage(error.response?.data?.message || "Unable to load creator data");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateBooking = async (bookingId, status) => {
    try {
      await axios.patch(`${API_URL}/api/creator/bookings/${bookingId}/status`, { status }, authConfig());
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to update booking");
    }
  };

  const stats = data.stats || {};
  const cards = [
    ["Total Events", stats.events || 0, "bg-violet-600"],
    ["Tickets Sold", stats.ticketsSold || 0, "bg-cyan-600"],
    ["Attendees", stats.attendees || 0, "bg-emerald-600"],
    ["Revenue", `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`, "bg-pink-600"],
  ];

  return (
    <DashboardLayout organizer title="Creator Panel">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Creator Dashboard</h2>
            <p className="mt-1 text-sm text-gray-400">Manage your events, attendees, and bookings.</p>
          </div>
          <NavLink to="/profile/create-event" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
            + Add New Event
          </NavLink>
        </div>

        {message && <p className="text-sm text-red-300">{message}</p>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(([label, value, color]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#10131d] p-4">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>◇</div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-1 text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Your Events</h3>
              <NavLink to="/events" className="text-sm text-violet-400">View public events</NavLink>
            </div>
            {loading ? <p className="text-sm text-gray-500">Loading events...</p> : data.events.length ? data.events.map((event) => (
              <div key={event._id} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                {event.image ? <img src={event.image} alt={event.title} className="h-16 w-20 rounded-lg object-cover" /> : <div className="grid h-16 w-20 place-items-center rounded-lg bg-violet-950 text-xs">Event</div>}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.city} · {event.date}</p>
                </div>
                <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${event.approvalStatus === "approved" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"}`}>{event.approvalStatus || "approved"}</span>
              </div>
            )) : <p className="text-sm text-gray-500">No events created yet.</p>}
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="mb-4 text-lg font-semibold text-white">Booking Confirmation</h3>
            <div className="space-y-3">
              {data.bookings.slice(0, 8).map((booking) => (
                <div key={booking._id} className="rounded-xl border border-white/10 bg-white/2 p-3">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0"><p className="truncate text-sm font-medium">{booking.eventName}</p><p className="text-xs text-gray-500">{booking.quantity} ticket(s) · ₹{booking.total}</p></div>
                    <span className="text-xs capitalize text-violet-300">{booking.status}</span>
                  </div>
                  {booking.status === "confirmed" && <div className="mt-3 flex gap-2"><button type="button" onClick={() => updateBooking(booking._id, "cancelled")} className="text-xs text-red-300">Cancel</button><button type="button" onClick={() => updateBooking(booking._id, "completed")} className="text-xs text-emerald-300">Complete</button></div>}
                </div>
              ))}
              {!loading && !data.bookings.length && <p className="text-sm text-gray-500">No bookings yet.</p>}
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
