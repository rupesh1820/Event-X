import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const getLocalBookings = () => {
  try {
    const bookings = JSON.parse(
      localStorage.getItem("eventxBookings") || "[]",
    );
    const userId = getUserId();
    return Array.isArray(bookings)
      ? bookings.filter(
          (booking) =>
            userId && String(booking.userId) === String(userId),
        )
      : [];
  } catch {
    return [];
  }
};

const getStatusStyle = (status) => {
  if (status === "cancelled") return "bg-red-500/15 text-red-300";
  if (status === "completed" || status === "past") {
    return "bg-gray-500/15 text-gray-300";
  }
  return "bg-emerald-500/15 text-emerald-300";
};

const MyRegistrations = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const userId = getUserId();

    const fetchBookings = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/book`, {
          params: { userId },
        });
        if (isMounted) setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Registrations fetch error:", error);
        if (isMounted) setBookings(getLocalBookings());
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout title="My Registrations">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">My Registrations</h2>
            <p className="mt-1 text-sm text-gray-400">Your upcoming event bookings and passes.</p>
          </div>
          <Link to="/events" className="text-sm font-medium text-violet-400 hover:text-violet-300">
            Explore more events
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {loading ? (
            <div className="xl:col-span-3 rounded-2xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
              Loading your registrations...
            </div>
          ) : bookings.length ? (
            bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-white/10 bg-[#10131d] p-4">
                <div className="overflow-hidden rounded-xl bg-violet-950">
                  {booking.eventImage ? (
                    <img src={booking.eventImage} alt={booking.eventName} className="h-44 w-full object-cover" />
                  ) : (
                    <div className="grid h-44 place-items-center text-sm text-violet-200">Event image unavailable</div>
                  )}
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-300">Event Registration</p>
                    <h3 className="mt-2 truncate text-xl font-bold text-white">{booking.eventName}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${getStatusStyle(booking.status)}`}>
                    {booking.status || "confirmed"}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-300">
                  <p>📍 {booking.eventLocation || "Location unavailable"}</p>
                  <p>🗓️ {booking.eventDate || "Date unavailable"}</p>
                  <p>⏰ {booking.eventTime || "Time unavailable"}</p>
                  <p>🎟️ {booking.quantity} ticket{booking.quantity === 1 ? "" : "s"} · ₹{Number(booking.total || 0)}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Ticket ID</p>
                    <p className="max-w-32 truncate font-semibold text-white">#{String(booking.id).slice(-8)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/profile/tickets")}
                    className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                  >
                    View Ticket
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="xl:col-span-3 rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center">
              <p className="text-lg font-semibold">No registrations yet</p>
              <p className="mt-2 text-sm text-gray-400">Book an event to see your registration here.</p>
              <Link to="/events" className="mt-5 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
                Explore Events
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRegistrations;
