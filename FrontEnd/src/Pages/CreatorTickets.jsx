import { useEffect, useMemo, useState } from "react";

const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";
const CreatorTicket = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    const token =
      localStorage.getItem("eventxToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    return token?.replace(/^Bearer\s+/i, "").trim();
  };

  const fetchCreatorBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Login token nahi mila. Please login again.");
      }

      const response = await fetch(
        `${API_URL}/api/creator/bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Server error: ${response.status}`
        );
      }

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
      setEvents(Array.isArray(data.events) ? data.events : []);
    } catch (err) {
      console.error("Creator bookings error:", err);
      setError(err.message || "Data fetch nahi ho paaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorBookings();
  }, []);

  const getName = (booking) =>
    booking.user?.fullName ||
    booking.fullName ||
    "Unknown User";

  const getEmail = (booking) =>
    booking.user?.emailAddress ||
    booking.emailAddress ||
    "Email not available";

  const getNumber = (booking) =>
    booking.user?.number ||
    booking.number ||
    "Number not available";

  const getEventName = (booking) =>
    booking.event?.title ||
    booking.event?.eventName ||
    booking.eventName ||
    "Unknown Event";

  const getAmount = (booking) =>
    Number(
      booking.total ??
        booking.amount ??
        booking.totalAmount ??
        0
    ).toLocaleString("en-IN");

  const getStatus = (booking) =>
    String(booking.status || "confirmed").toLowerCase();

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const value = search.toLowerCase();

      const matchesSearch =
        getName(booking).toLowerCase().includes(value) ||
        getEmail(booking).toLowerCase().includes(value) ||
        getEventName(booking).toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(booking) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  const confirmed = bookings.filter(
    (booking) => getStatus(booking) === "confirmed"
  ).length;

  const pending = bookings.filter(
    (booking) => getStatus(booking) === "pending"
  ).length;

  const revenue = bookings
    .filter((booking) => getStatus(booking) === "confirmed")
    .reduce(
      (sum, booking) =>
        sum +
        Number(
          booking.total ??
            booking.amount ??
            booking.totalAmount ??
            0
        ),
      0
    );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080711] text-white">
        <div className="text-center">
          <p className="text-lg text-gray-300">
            Loading creator bookings...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Backend se data aa raha hai
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080711] px-5 text-center text-white">
        <div>
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchCreatorBookings}
            className="mt-5 rounded-lg bg-violet-600 px-5 py-3"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] px-4 py-6 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">
          Creator Dashboard
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your bookings and events
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-[#151320] p-5">
            <p className="text-gray-400">Total Bookings</p>
            <h2 className="mt-3 text-3xl font-bold">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-xl bg-[#151320] p-5">
            <p className="text-gray-400">My Events</p>
            <h2 className="mt-3 text-3xl font-bold">
              {events.length}
            </h2>
          </div>

          <div className="rounded-xl bg-[#151320] p-5">
            <p className="text-gray-400">Confirmed</p>
            <h2 className="mt-3 text-3xl font-bold">
              {confirmed}
            </h2>
          </div>

          <div className="rounded-xl bg-[#151320] p-5">
            <p className="text-gray-400">Revenue</p>
            <h2 className="mt-3 text-3xl font-bold">
              ₹{revenue.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-[#11101b] p-5">
          <div className="mb-5 flex flex-col gap-3 md:flex-row">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user or event..."
              className="flex-1 rounded-lg bg-[#1a1828] px-4 py-3 outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg bg-[#1a1828] px-4 py-3 outline-none"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {filteredBookings.length === 0 ? (
            <p className="py-10 text-center text-gray-400">
              No bookings found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="p-4">User</th>
                    <th className="p-4">Event</th>
                    <th className="p-4">Tickets</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/10"
                    >
                      <td className="p-4">
                        <p className="font-semibold">
                          {getName(booking)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {getEmail(booking)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {getNumber(booking)}
                        </p>
                      </td>

                      <td className="p-4">
                        {getEventName(booking)}
                      </td>

                      <td className="p-4">
                        {Number(booking.quantity || 1)}
                      </td>

                      <td className="p-4 text-violet-400">
                        ₹{getAmount(booking)}
                      </td>

                      <td className="p-4 capitalize">
                        {getStatus(booking)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pending > 0 && (
          <p className="mt-4 text-yellow-400">
            {pending} pending booking available.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatorTicket;