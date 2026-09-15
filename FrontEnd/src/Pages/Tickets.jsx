import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";
import { events } from "../Data/Data";

const tabs = ["upcoming", "past", "cancelled"];

const readBookings = () => {
  try {
    const savedBookings = JSON.parse(
      localStorage.getItem("eventxBookings") || "[]",
    );
    if (!Array.isArray(savedBookings)) return [];

    const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
    const userId = user?._id || user?.id;

    return savedBookings.filter((booking) =>
      userId ? String(booking.userId) === String(userId) : !booking.userId,
    );
  } catch {
    return [];
  }
};

// const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001"
    const API_URL = import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};



const getEventDetails = (booking) => {
  const matchingEvent = events.find(
    (event) => String(event.id) === String(booking.eventId),
  );

  return {
    name: booking.eventName || matchingEvent?.name || "Event",
    image: booking.eventImage || matchingEvent?.image,
    location:
      booking.eventLocation ||
      matchingEvent?.location ||
      "Location unavailable",
    date:
      booking.eventDate ||
      (matchingEvent
        ? `${matchingEvent.day} ${matchingEvent.month} ${matchingEvent.year}`
        : null),
    time: booking.eventTime || matchingEvent?.time || "Time unavailable",
  };
};

const parseEventDate = (value) => {
  if (!value) return null;

  const nativeDate = new Date(value);
  if (!Number.isNaN(nativeDate.getTime())) return nativeDate;

  const dateParts = String(value).match(/^(\d{1,2})[-/]\d{1,2}[-/](\d{4})$/);
  if (!dateParts) return null;

  const [, day, month, year] = String(value).split(/[-/]/);
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const getBookingCategory = (booking) => {
  if (booking.status === "cancelled") return "cancelled";

  const eventDate = parseEventDate(booking.eventDate);
  if (eventDate && eventDate < new Date()) {
    return "past";
  }

  return booking.status === "completed" || booking.status === "past"
    ? "past"
    : "upcoming";
};

const downloadBookings = (bookings) => {
  if (!bookings.length) return;

  const ticketText = bookings
    .map((booking) => {
      const event = getEventDetails(booking);
      return [
        "EVENTX TICKET",
        "==============================",
        `Event: ${event.name}`,
        `Location: ${event.location}`,
        `Date: ${event.date || event.time}`,
        `Ticket ID: ${booking.id}`,
        `Tickets: ${booking.quantity}`,
        `Total: Rs. ${booking.total}`,
        `Status: ${booking.status}`,
        "==============================",
      ].join("\n");
    })
    .join("\n\n");
  const url = URL.createObjectURL(new Blob([ticketText], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download =
    bookings.length === 1 ? "eventx-ticket.txt" : "eventx-tickets.txt";
  link.click();
  URL.revokeObjectURL(url);
};

const ticketQrValue = (booking) =>
  JSON.stringify({
    ticketId: booking.id,
    eventId: booking.eventId,
    quantity: booking.quantity,
  });

const Tickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      const userId = getCurrentUserId();

      if (!userId) {
        if (isMounted) {
          setBookings([]);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/book`, {
          params: { userId },
        });
        if (isMounted) setBookings(response.data.bookings || []);
      } catch (error) {
        console.error("Get tickets error:", error);
        if (isMounted) setBookings(readBookings());
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const counts = useMemo(
    () => ({
      total: bookings.reduce(
        (sum, booking) => sum + Number(booking.quantity || 0),
        0,
      ),
      upcoming: bookings
        .filter((booking) => getBookingCategory(booking) === "upcoming")
        .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0),
      past: bookings
        .filter((booking) => getBookingCategory(booking) === "past")
        .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0),
      cancelled: bookings
        .filter((booking) => getBookingCategory(booking) === "cancelled")
        .reduce((sum, booking) => sum + Number(booking.quantity || 0), 0),
    }),
    [bookings],
  );

  const visibleBookings = bookings.filter(
    (booking) => getBookingCategory(booking) === activeTab,
  );

  const cancelBooking = async (bookingId) => {
    const userId = getCurrentUserId();
    if (!userId) return;

    setCancelling(true);

    try {
      await axios.patch(`${API_URL}/api/book/${bookingId}`, { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("eventxToken") || ""}`,
        },
      });
      const updatedBookings = bookings.map((booking) =>
        String(booking.id) === String(bookingId)
          ? { ...booking, status: "cancelled" }
          : booking,
      );
      setBookings(updatedBookings);
      localStorage.setItem("eventxBookings", JSON.stringify(updatedBookings));
      setSelectedBooking(null);
    } catch (error) {
      console.error("Cancel ticket error:", error);
      alert(error.response?.data?.message || "Unable to cancel ticket");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <DashboardLayout title="My Tickets">
      <div className="mx-auto max-w-6xl space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">My Tickets</h2>
            <p className="mt-1 text-sm text-gray-400">
              View and manage all your event tickets in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => downloadBookings(bookings)}
            disabled={!bookings.length}
            className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm text-violet-300 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↓ Download All Tickets
          </button>
        </div>

        <div className="flex gap-5 border-b border-white/10 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-2 py-3 capitalize transition ${activeTab === tab ? "border-violet-500 text-violet-400" : "border-transparent text-gray-500 hover:text-gray-300"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total Tickets", counts.total],
            ["Upcoming", counts.upcoming],
            ["Past", counts.past],
            ["Cancelled", counts.cancelled],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-white/10 bg-[#10131d] p-4"
            >
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-2 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
              Loading your tickets...
            </div>
          ) : visibleBookings.length ? (
            visibleBookings.map((booking) => {
              const event = getEventDetails(booking);
              const category = getBookingCategory(booking);

              return (
                <article
                  key={booking.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#10131d]"
                >
                  <div className="relative h-44 w-full bg-violet-950">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-sm text-violet-200">
                        Event image unavailable
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-4">
                    <div>
                      <h3 className="truncate text-lg font-semibold">
                        {event.name}
                      </h3>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        ⌖ {event.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        ◷ {event.date || event.time}
                      </p>
                    </div>

                    <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4 text-sm">
                      <div>
                        <p className="text-violet-400">
                          {booking.quantity} Ticket
                          {booking.quantity === 1 ? "" : "s"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {booking.paymentMethod || "General Entry"}
                        </p>
                        <p className="font-semibold">
                          ₹{Number(booking.total || 0)}
                        </p>
                      </div>
                      <QRCodeSVG
                        value={ticketQrValue(booking)}
                        size={48}
                        level="M"
                        bgColor="#ffffff"
                        fgColor="#000000"
                        aria-label="Ticket QR code"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBooking(booking)}
                      className="w-full rounded-lg border border-white/10 px-3 py-2 text-violet-300 transition hover:border-violet-500 hover:text-white"
                    >
                      View Ticket
                    </button>
                  </div>
                  {category === "cancelled" && (
                    <span className="text-xs font-semibold uppercase text-red-300">
                      Cancelled
                    </span>
                  )}
                </article>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center">
              <p className="text-lg font-semibold">No {activeTab} tickets</p>
              <p className="mt-2 text-sm text-gray-400">
                Book an event to see your ticket here.
              </p>
              <Link
                to="/events"
                className="mt-5 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500"
              >
                Explore Events
              </Link>
            </div>
          )}
        </div>
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10131d] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-violet-300">
                  Ticket details
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  {getEventDetails(selectedBooking).name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-2xl text-gray-400 hover:text-white"
                aria-label="Close ticket details"
              >
                ×
              </button>
            </div>
            <div className="mt-5 space-y-3 rounded-xl bg-white/5 p-4 text-sm text-gray-300">
              <p>
                Ticket ID:{" "}
                <span className="text-white">{selectedBooking.id}</span>
              </p>
              <p>
                Tickets:{" "}
                <span className="text-white">{selectedBooking.quantity}</span>
              </p>
              <p>
                Total:{" "}
                <span className="text-white">
                  ₹{Number(selectedBooking.total || 0)}
                </span>
              </p>
              <p>
                Status:{" "}
                <span className="capitalize text-white">
                  {selectedBooking.status}
                </span>
              </p>
            </div>
            <div className="mt-5 flex justify-center rounded-xl bg-white p-4">
              <QRCodeSVG
                value={ticketQrValue(selectedBooking)}
                size={180}
                level="H"
                bgColor="#ffffff"
                fgColor="#111111"
                aria-label="Ticket QR code"
              />
            </div>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {getBookingCategory(selectedBooking) === "upcoming" && (
                <button
                  type="button"
                  onClick={() => cancelBooking(selectedBooking.id)}
                  disabled={cancelling}
                  className="rounded-lg border border-red-400/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Ticket"}
                </button>
              )}
              <button
                type="button"
                onClick={() => downloadBookings([selectedBooking])}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500"
              >
                Download Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Tickets;
