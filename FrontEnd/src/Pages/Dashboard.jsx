import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";

const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("eventxUser") || "null");
  } catch {
    return null;
  }
};

const getEventDate = (booking) => {
  if (!booking.eventDate) return null;
  const eventDate = new Date(booking.eventDate);
  return Number.isNaN(eventDate.getTime()) ? null : eventDate;
};

const isPastBooking = (booking) => {
  const eventDate = getEventDate(booking);
  return (
    booking.status === "completed" ||
    booking.status === "past" ||
    (eventDate && eventDate < new Date())
  );
};

const getTicketEvent = (booking) => ({
  name: booking.eventName || "Event",
  image: booking.eventImage,
  location: booking.eventLocation || "Location unavailable",
  date: booking.eventDate || "Date unavailable",
  time: booking.eventTime || "Time unavailable",
});

const Card = ({ children, className = "" }) => (
  <section
    className={`rounded-xl border border-white/10 bg-[#10131d] p-4 sm:p-5 ${className}`}
  >
    {children}
  </section>
);

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    let isMounted = true;
    const userId = user?._id || user?.id;

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
        console.error("Dashboard bookings error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, [user?._id, user?.id]);

  const stats = useMemo(() => {
    const activeBookings = bookings.filter(
      (booking) => booking.status !== "cancelled",
    );
    const upcomingBookings = activeBookings.filter(
      (booking) => !isPastBooking(booking),
    );
    const pastBookings = activeBookings.filter(isPastBooking);
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled",
    );

    return {
      totalTickets: activeBookings.reduce(
        (sum, booking) => sum + Number(booking.quantity || 0),
        0,
      ),
      upcoming: upcomingBookings.length,
      completed: pastBookings.length,
      cancelled: cancelledBookings.length,
      upcomingBookings,
      latestBooking: bookings[0],
    };
  }, [bookings]);

  const wishlistCount = (() => {
    try {
      const wishlist = JSON.parse(
        localStorage.getItem("eventxWishlist") || "[]",
      );
      return Array.isArray(wishlist) ? wishlist.length : 0;
    } catch {
      return 0;
    }
  })();

  const statCards = [
    ["Tickets", stats.totalTickets, "Total purchased tickets", "bg-violet-600", "/profile/tickets"],
    ["Registrations", stats.upcoming, "Upcoming events", "bg-pink-600", "/profile/tickets"],
    ["Completed Events", stats.completed, "Events attended", "bg-green-600", "/profile/tickets"],
    ["Wishlist", wishlistCount, "Saved events", "bg-blue-600", "/wishlist"],
  ];

  const latestEvent = stats.latestBooking
    ? getTicketEvent(stats.latestBooking)
    : null;

  return (
    <DashboardLayout title="Dashboard">
      <div className="mx-auto max-w-7xl space-y-5">
      <div>
        <h2 className="text-2xl font-bold sm:text-3xl">
          Welcome back, {user?.fullName || "EventX Member"}! <span>👋</span>
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Here&apos;s what&apos;s happening with your events.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value, sub, color, path]) => (
          <Card key={label}>
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
            >
              ◇
            </div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{sub}</p>
            <NavLink to={path} className="mt-4 block text-xs text-violet-400">
              View all ?
            </NavLink>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.4fr_.9fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Upcoming Events</h3>
              <p className="text-xs text-gray-500">Your next experiences</p>
            </div>
            <NavLink to="/profile/tickets" className="text-sm text-violet-400">
              View all ?
            </NavLink>
          </div>
          <div className="divide-y divide-white/10">
            {loading ? (
              <p className="py-8 text-center text-sm text-gray-500">Loading your events...</p>
            ) : stats.upcomingBookings.length ? (
              stats.upcomingBookings.slice(0, 4).map((booking) => {
                const event = getTicketEvent(booking);
                return (
                  <div key={booking.id} className="flex items-center gap-3 py-3">
                    {event.image ? (
                      <img src={event.image} alt={event.name} className="h-14 w-20 rounded-lg object-cover" />
                    ) : (
                      <div className="grid h-14 w-20 place-items-center rounded-lg bg-violet-950 text-xs text-violet-200">Event</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{event.name}</p>
                      <p className="mt-1 truncate text-xs text-gray-500">⌖ {event.location}</p>
                      <p className="text-xs text-gray-500">◷ {event.date} · {event.time}</p>
                    </div>
                    <NavLink to="/profile/tickets" className="hidden rounded-lg bg-violet-600/20 px-3 py-2 text-xs text-violet-300 sm:block">View Ticket</NavLink>
                  </div>
                );
              })
            ) : (
              <p className="py-8 text-center text-sm text-gray-500">No upcoming tickets yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your Tickets</h3>
            <NavLink to="/profile/tickets" className="text-sm text-violet-400">
              View all ?
            </NavLink>
          </div>
          {latestEvent ? (
            <div className="overflow-hidden rounded-xl bg-linear-to-br from-violet-700 to-violet-950">
              {latestEvent.image && <img src={latestEvent.image} alt={latestEvent.name} className="h-32 w-full object-cover opacity-90" />}
              <div className="p-4">
                <p className="text-sm font-semibold">{latestEvent.name}</p>
                <p className="mt-2 text-xs text-violet-200">{latestEvent.location}</p>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-violet-200">{latestEvent.date}</p>
                    <p className="mt-2 text-xs">{stats.latestBooking.quantity} ticket(s)</p>
                  </div>
                  <div className="grid h-16 w-16 place-items-center bg-white text-3xl text-black">▦</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-white/5 p-6 text-center text-sm text-gray-500">No tickets purchased yet.</div>
          )}
        </Card>
      </div>
      <Card className="bg-linear-to-r from-violet-950 to-[#151024]">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-semibold">Never Miss an Event!</h3>
            <p className="mt-1 text-sm text-violet-200">
              Enable notifications and get updates about your favourite events.
            </p>
          </div>
          <button className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold">
            Enable Notifications
          </button>
        </div>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
