import axios from "axios";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";

const getUserId = () => {
  try {
    const user = JSON.parse(
      localStorage.getItem("eventxUser") || "null",
    );

    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const getReadIds = () => {
  try {
    const readIds = JSON.parse(
      localStorage.getItem("eventxReadNotifications") || "[]",
    );

    return Array.isArray(readIds)
      ? readIds.map(String)
      : [];
  } catch {
    return [];
  }
};

const formatTime = (dateValue) => {
  if (!dateValue) return "Recently";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const diffInMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );

  if (diffInMinutes < 60) {
    return `${Math.max(diffInMinutes, 1)} min ago`;
  }

  if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hours ago`;
  }

  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

const getBookingNotification = (booking) => {
  const isCancelled = booking.status === "cancelled";

  const isPast =
    booking.status === "past" ||
    booking.status === "completed";

  const bookingId = booking._id || booking.id;

  const createdAt =
    booking.createdAt || booking.bookedAt;

  return {
    id: `booking-${bookingId}`,
    type: "booking",

    title: isCancelled
      ? "Booking cancelled"
      : isPast
        ? "Event completed"
        : "Ticket confirmed",

    text: isCancelled
      ? `Your booking for ${
          booking.eventName || "this event"
        } was cancelled.`
      : isPast
        ? `Your registration for ${
            booking.eventName || "this event"
          } is now complete.`
        : `${booking.quantity || 1} ticket(s) for ${
            booking.eventName || "your event"
          } are confirmed and ready.`,

    time: formatTime(createdAt),
    createdAt,

    accent: isCancelled
      ? "bg-red-500"
      : isPast
        ? "bg-gray-500"
        : "bg-emerald-500",
  };
};

const getInquiryNotification = (inquiry) => {
  return {
    id: `inquiry-${inquiry._id}`,
    type: "inquiry",

    title: "New Contact Enquiry",

    text: `${inquiry.name} ne contact form se enquiry bheji hai. Email: ${
      inquiry.email
    }. Subject: ${inquiry.subject}. Message: ${
      inquiry.message
    }`,

    time: formatTime(inquiry.createdAt),
    createdAt: inquiry.createdAt,

    accent:
      inquiry.status === "open"
        ? "bg-violet-500"
        : "bg-gray-500",
  };
};

const Notifications = () => {
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [readIds, setReadIds] = useState(getReadIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const userId = getUserId();

        const inquiryResponse = await axios.get(
          `${API_URL}/api/inquiries`,
        );

        if (isMounted) {
          setInquiries(
            inquiryResponse.data.inquiries || [],
          );
        }

        if (userId) {
          const bookingResponse = await axios.get(
            `${API_URL}/api/book`,
            {
              params: { userId },
            },
          );

          if (isMounted) {
            setBookings(
              bookingResponse.data.bookings || [],
            );
          }
        }
      } catch (error) {
        console.error(
          "Notifications fetch error:",
          error,
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const notifications = useMemo(() => {
    const bookingNotifications = bookings.map(
      getBookingNotification,
    );

    const inquiryNotifications = inquiries.map(
      getInquiryNotification,
    );

    return [
      ...inquiryNotifications,
      ...bookingNotifications,
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime(),
    );
  }, [bookings, inquiries]);

  const unreadCount = notifications.filter(
    (notification) =>
      !readIds.includes(notification.id),
  ).length;

  const markAsRead = async (notification) => {
    const updatedIds = [
      ...new Set([
        ...readIds,
        String(notification.id),
      ]),
    ];

    setReadIds(updatedIds);

    localStorage.setItem(
      "eventxReadNotifications",
      JSON.stringify(updatedIds),
    );

    if (
      notification.type === "inquiry" &&
      notification.id.startsWith("inquiry-")
    ) {
      const inquiryId = notification.id.replace(
        "inquiry-",
        "",
      );

      try {
        await axios.patch(
          `${API_URL}/api/inquiries/${inquiryId}/resolve`,
        );

        setInquiries((previous) =>
          previous.map((inquiry) =>
            inquiry._id === inquiryId
              ? {
                  ...inquiry,
                  status: "resolved",
                }
              : inquiry,
          ),
        );
      } catch (error) {
        console.error(
          "Resolve inquiry error:",
          error,
        );
      }
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(
      (notification) => notification.id,
    );

    setReadIds(allIds);

    localStorage.setItem(
      "eventxReadNotifications",
      JSON.stringify(allIds),
    );
  };

  return (
    <div title="Notifications">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Notifications
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Stay informed about your tickets, bookings
              and contact enquiries.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-sm font-medium text-violet-400 hover:text-violet-300"
            >
              Mark all as read ({unreadCount})
            </button>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
              Loading notifications...
            </div>
          ) : notifications.length ? (
            notifications.map((item) => {
              const isRead = readIds.includes(item.id);

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => markAsRead(item)}
                  className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition hover:border-violet-500/50 ${
                    isRead
                      ? "border-white/10 bg-[#10131d] opacity-70"
                      : "border-violet-500/30 bg-[#151225]"
                  }`}
                >
                  <div
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.accent}`}
                  />

                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-white">
                        {item.title}
                      </h3>

                      <span className="text-xs text-gray-500">
                        {item.time}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      {item.text}
                    </p>

                    <p className="mt-2 text-xs text-violet-300">
                      {isRead
                        ? "Read"
                        : "New notification"}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center text-gray-400">
              No notifications yet. Your booking and
              contact updates will appear here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;