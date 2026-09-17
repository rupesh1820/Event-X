import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/https://eventx-backend-pq2m.onrender.com";

const AdminBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [eventSummary, setEventSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("eventxUser") || "null"
  );

  const token = localStorage.getItem("eventxToken");

  const fetchBookings = useCallback(async () => {
    try {
      if (!token) {
        throw new Error("Token nahi mila. Please login again.");
      }

      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {
            message: `API route not found. Status: ${response.status}`,
          };

      if (response.status === 401) {
        localStorage.removeItem("eventxToken");
        localStorage.removeItem("eventxUser");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        alert(data.message || "Admin access required.");
        navigate("/profile");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Bookings fetch failed");
      }

      setBookings(data.bookings || []);
      setEventSummary(data.eventSummary || []);
    } catch (error) {
      console.error("Admin bookings error:", error);
      alert(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      navigate("/profile");
      return;
    }

    fetchBookings();
  }, [currentUser, fetchBookings, navigate]);

  const totalTickets = bookings.reduce(
    (total, booking) =>
      total + Number(booking.quantity || booking.ticketCount || 1),
    0
  );

  const totalRevenue = bookings.reduce(
  (total, booking) => total + Number(booking.total || 0),
  0
);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Bookings</h1>

            <p className="mt-2 text-gray-400">
              View all ticket bookings and event sales.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back to Profile
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-gray-400">Total Bookings</p>
            <h2 className="mt-2 text-3xl font-bold">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-gray-400">Tickets Sold</p>
            <h2 className="mt-2 text-3xl font-bold">
              {totalTickets}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-gray-400">Total Revenue</p>
            <h2 className="mt-2 text-3xl font-bold">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-gray-400">Total Events</p>
            <h2 className="mt-2 text-3xl font-bold">
              {eventSummary.length}
            </h2>
          </div>
        </div>

        {/* Event Wise Summary */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Event-wise Booking Summary
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-gray-400">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Total Bookings</th>
                  <th className="px-6 py-4">Tickets Sold</th>
                  <th className="px-6 py-4">Revenue</th>
                </tr>
              </thead>

              <tbody>
                {eventSummary.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No event booking data found.
                    </td>
                  </tr>
                ) : (
                  eventSummary.map((event) => (
                    <tr
                      key={event.eventId}
                      className="border-b border-white/10 last:border-b-0"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">
                          {event.eventTitle || "Unknown Event"}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-gray-300">
                        {event.creatorName || "Unknown Creator"}
                      </td>

                      <td className="px-6 py-5 text-gray-300">
                        {event.totalBookings || 0}
                      </td>

                      <td className="px-6 py-5 text-gray-300">
                        {event.totalTickets || 0}
                      </td>

                      <td className="px-6 py-5 font-semibold text-green-400">
                        ₹{Number(event.revenue || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* All Bookings */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="text-xl font-semibold">
              All Ticket Bookings
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 bg-black/20 text-gray-400">
                <tr>
                  <th className="px-6 py-4">Buyer</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Tickets</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const quantity =
                      booking.quantity ||
                      booking.ticketCount ||
                      1;

                    const amount = Number(booking.total || 0);

                    return (
                      <tr
                        key={booking._id}
                        className="border-b border-white/10 last:border-b-0"
                      >
                        <td className="px-6 py-5">
                          <p className="font-semibold">
                            {booking.buyer?.fullName ||
                              booking.user?.fullName ||
                              booking.userName ||
                              "Unknown Buyer"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.buyer?.emailAddress ||
                              booking.user?.emailAddress ||
                              booking.emailAddress ||
                              "No email"}
                          </p>
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {booking.event?.title ||
                            booking.event?.eventTitle ||
                            booking.eventTitle ||
                            "Unknown Event"}
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {booking.event?.creator?.fullName ||
                            booking.creator?.fullName ||
                            booking.creatorName ||
                            "Unknown Creator"}
                        </td>

                        <td className="px-6 py-5 text-gray-300">
                          {quantity}
                        </td>

                        <td className="px-6 py-5 font-semibold text-green-400">
                          ₹{Number(amount).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              booking.status === "cancelled"
                                ? "bg-red-500/10 text-red-400"
                                : "bg-green-500/10 text-green-400"
                            }`}
                          >
                            {booking.status || "confirmed"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-gray-400">
                          {booking.createdAt
                            ? new Date(
                                booking.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;