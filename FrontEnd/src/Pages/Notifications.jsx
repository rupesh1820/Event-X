import axios from "axios";
import { useEffect, useMemo, useState } from "react";
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

const getReadIds = () => {
  try {
    const readIds = JSON.parse(
      localStorage.getItem("eventxReadNotifications") || "[]",
    );
    return Array.isArray(readIds) ? readIds.map(String) : [];
  } catch {
    return [];
  }
};

const formatTime = (dateValue) => {
  if (!dateValue) return "Recently";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffInMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );
  if (diffInMinutes < 60) return `${Math.max(diffInMinutes, 1)} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
  return `${Math.floor(diffInMinutes / 1440)} days ago`;
};

const getNotification = (booking) => {
  const isCancelled = booking.status === "cancelled";
  const isPast = booking.status === "past" || booking.status === "completed";

  return {
    id: String(booking.id),
    title: isCancelled
      ? "Booking cancelled"
      : isPast
        ? "Event completed"
        : "Ticket confirmed",
    text: isCancelled
      ? `Your booking for ${booking.eventName || "this event"} was cancelled.`
      : isPast
        ? `Your registration for ${booking.eventName || "this event"} is now complete.`
        : `${booking.quantity || 1} ticket(s) for ${booking.eventName || "your event"} are confirmed and ready.`,
    time: formatTime(booking.createdAt || booking.bookedAt),
    accent: isCancelled
      ? "bg-red-500"
      : isPast
        ? "bg-gray-500"
        : "bg-emerald-500",
  };
};

const Notifications = () => {
  const [bookings, setBookings] = useState([]);
  const [readIds, setReadIds] = useState(getReadIds);
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
        console.error("Notifications fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const notifications = useMemo(
    () => bookings.map(getNotification),
    [bookings],
  );
  const unreadCount = notifications.filter(
    (notification) => !readIds.includes(notification.id),
  ).length;

  const markAsRead = (notificationId) => {
    const updatedIds = [...new Set([...readIds, String(notificationId)])];
    setReadIds(updatedIds);
    localStorage.setItem("eventxReadNotifications", JSON.stringify(updatedIds));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((notification) => notification.id);
    setReadIds(allIds);
    localStorage.setItem("eventxReadNotifications", JSON.stringify(allIds));
  };

  return (
    <DashboardLayout title="Notifications">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Notifications</h2>
            <p className="mt-1 text-sm text-gray-400">
              Stay informed about your tickets and event bookings.
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
                  onClick={() => markAsRead(item.id)}
                  className={`flex w-full gap-4 rounded-2xl border p-4 text-left transition hover:border-violet-500/50 ${isRead ? "border-white/10 bg-[#10131d] opacity-70" : "border-violet-500/30 bg-[#151225]"}`}
                >
                  <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.accent}`} />
                  <div className="flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{item.text}</p>
                    <p className="mt-2 text-xs text-violet-300">
                      {isRead ? "Read" : "New notification"}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center text-gray-400">
              No notifications yet. Your booking updates will appear here.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
