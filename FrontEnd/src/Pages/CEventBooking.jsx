import { useEffect, useMemo, useState } from "react";

const API_URL =
  import.meta.env.VITE_SERVER || "http://localhost:5001"
const CEventBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  const getToken = () => {
    return (
      localStorage.getItem("eventxToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    )?.replace(/^Bearer\s+/i, "");
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Login token nahi mila.");
      }

      const res = await fetch(
        `${API_URL}/api/creator/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Bookings fetch failed");
      }

      setBookings(data.bookings || []);
      setEvents(data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getEventName = (booking) =>
    booking.event?.title ||
    booking.eventName ||
    "Unknown Event";

  const getUserName = (booking) =>
    booking.user?.fullName ||
    booking.fullName ||
    "Unknown User";

  const getEmail = (booking) =>
    booking.user?.emailAddress ||
    booking.emailAddress ||
    "Email unavailable";

  const getAmount = (booking) =>
    Number(
      booking.total ??
        booking.amount ??
        booking.totalAmount ??
        0
    );

  const getQuantity = (booking) =>
    Number(booking.quantity || 1);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchValue = search.toLowerCase();

      const searchMatch =
        getUserName(booking)
          .toLowerCase()
          .includes(searchValue) ||
        getEmail(booking)
          .toLowerCase()
          .includes(searchValue) ||
        getEventName(booking)
          .toLowerCase()
          .includes(searchValue);

      const eventMatch =
        selectedEvent === "all" ||
        String(booking.eventId) === String(selectedEvent);

      return searchMatch && eventMatch;
    });
  }, [bookings, search, selectedEvent]);

  const totalTickets = bookings.reduce(
    (sum, booking) => sum + getQuantity(booking),
    0
  );

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + getAmount(booking),
    0
  );

  const selectedEventData =
    selectedEvent === "all"
      ? null
      : events.find(
          (event) =>
            String(event._id) === String(selectedEvent)
        );

  const eventStats = selectedEventData
    ? {
        sold: selectedEventData.bookedSeats || 0,
        left: selectedEventData.seatsLeft || 0,
        revenue: bookings
          .filter(
            (booking) =>
              String(booking.eventId) ===
              String(selectedEventData._id)
          )
          .reduce(
            (sum, booking) => sum + getAmount(booking),
            0
          ),
      }
    : null;

  const deleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Kya aap is booking ko delete karna chahte ho?"
    );

    if (!confirmDelete) return;

    try {
      setActionLoading(bookingId);

      const token = getToken();

      const res = await fetch(
        `${API_URL}/api/creator/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Booking delete nahi hui"
        );
      }

      setBookings((prev) =>
        prev.filter(
          (booking) => booking._id !== bookingId
        )
      );

      alert("Booking deleted successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading("");
    }
  };

  const refundBooking = async (bookingId) => {
    const confirmRefund = window.confirm(
      "Is booking ka payment refund karna hai?"
    );

    if (!confirmRefund) return;

    try {
      setActionLoading(bookingId);

      const token = getToken();

      const res = await fetch(
        `${API_URL}/api/creator/bookings/${bookingId}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Refund failed"
        );
      }

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "refunded" }
            : booking
        )
      );

      alert("Refund successfully processed");
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080711] flex items-center justify-center text-white">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#080711] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-4 rounded-lg bg-violet-600 px-5 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] px-4 py-8 text-white">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Event Bookings
          </h1>

          <p className="mt-2 text-gray-400">
            Manage your events, tickets and customers
          </p>
        </div>

        {/* Overall Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-[#151320] p-5">
            <p className="text-sm text-gray-400">
              Total Events
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {events.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#151320] p-5">
            <p className="text-sm text-gray-400">
              Total Bookings
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {bookings.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#151320] p-5">
            <p className="text-sm text-gray-400">
              Tickets Sold
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              {totalTickets}
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#151320] p-5">
            <p className="text-sm text-gray-400">
              Total Revenue
            </p>
            <h2 className="mt-2 text-3xl font-bold text-violet-400">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h2>
          </div>

        </div>

        {/* Event Selection */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#11101b] p-5">

          <div className="flex flex-col gap-4 md:flex-row">

            <select
              value={selectedEvent}
              onChange={(e) =>
                setSelectedEvent(e.target.value)
              }
              className="rounded-lg bg-[#1a1828] px-4 py-3 outline-none md:w-80"
            >
              <option value="all">
                All Events
              </option>

              {events.map((event) => (
                <option
                  key={event._id}
                  value={event._id}
                >
                  {event.title}
                </option>
              ))}
            </select>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search customer or event..."
              className="flex-1 rounded-lg bg-[#1a1828] px-4 py-3 outline-none"
            />

          </div>

          {/* Selected Event Stats */}
          {eventStats && (
            <div className="mt-5 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-[#191726] p-4">
                <p className="text-sm text-gray-400">
                  Tickets Sold
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {eventStats.sold}
                </p>
              </div>

              <div className="rounded-xl bg-[#191726] p-4">
                <p className="text-sm text-gray-400">
                  Tickets Left
                </p>
                <p className="mt-1 text-2xl font-bold text-green-400">
                  {eventStats.left}
                </p>
              </div>

              <div className="rounded-xl bg-[#191726] p-4">
                <p className="text-sm text-gray-400">
                  Event Revenue
                </p>
                <p className="mt-1 text-2xl font-bold text-violet-400">
                  ₹{eventStats.revenue.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Booking Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#11101b]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Tickets</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredBookings.map((booking) => {

                  const status =
                    String(
                      booking.status || "confirmed"
                    ).toLowerCase();

                  return (
                    <tr
                      key={booking._id}
                      className="border-b border-white/10 hover:bg-white/[0.02]"
                    >

                      {/* Customer */}
                      <td className="p-4">
                        <p className="font-semibold">
                          {getUserName(booking)}
                        </p>

                        <p className="text-sm text-gray-400">
                          {getEmail(booking)}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.user?.number ||
                            booking.number ||
                            "Number unavailable"}
                        </p>
                      </td>

                      {/* Event */}
                      <td className="p-4">
                        <p className="font-medium">
                          {getEventName(booking)}
                        </p>

                        <p className="text-xs text-gray-500">
                          {booking.event?.date || ""}
                        </p>
                      </td>

                      {/* Tickets */}
                      <td className="p-4">
                        {getQuantity(booking)}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-semibold text-violet-400">
                        ₹
                        {getAmount(booking).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs ${
                            status === "confirmed"
                              ? "bg-green-500/10 text-green-400"
                              : status === "refunded"
                              ? "bg-blue-500/10 text-blue-400"
                              : status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            disabled={
                              actionLoading === booking._id
                            }
                            onClick={() =>
                              refundBooking(booking._id)
                            }
                            className="rounded-lg bg-blue-600/20 px-3 py-2 text-xs text-blue-400 hover:bg-blue-600/30 disabled:opacity-50"
                          >
                            Refund
                          </button>

                          <button
                            disabled={
                              actionLoading === booking._id
                            }
                            onClick={() =>
                              deleteBooking(booking._id)
                            }
                            className="rounded-lg bg-red-600/20 px-3 py-2 text-xs text-red-400 hover:bg-red-600/30 disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {filteredBookings.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              No bookings found.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CEventBooking;