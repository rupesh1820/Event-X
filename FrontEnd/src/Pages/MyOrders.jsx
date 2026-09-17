import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


 const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";
// const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";
const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

const getStatusStyle = (status) => {
  if (status === "cancelled") return "bg-red-500/15 text-red-300";
  if (status === "completed" || status === "past") {
    return "bg-gray-500/15 text-gray-300";
  }
  return "bg-emerald-500/15 text-emerald-300";
};

const getBookingDate = (booking) => {
  const date = booking.createdAt || booking.bookedAt;
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? "Date unavailable"
    : parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const userId = getUserId();

    const fetchOrders = async () => {
      if (!userId) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/book`, {
          params: { userId },
        });
        if (isMounted) setOrders(response.data.bookings || []);
      } catch (error) {
        console.error("Orders fetch error:", error);
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div title="My Orders">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">My Orders</h2>
          <p className="mt-1 text-sm text-gray-400">
            Track your purchases and payments.
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
            Loading your orders...
          </div>
        ) : orders.length ? (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#10131d]">
            <div className="min-w-[680px]">
              <div className="grid grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.8fr] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                <span>Order</span>
                <span>Item</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-[1.2fr_1.4fr_1fr_0.8fr_0.8fr] gap-3 border-b border-white/10 px-4 py-4 text-sm text-gray-300 last:border-0"
                >
                  <div>
                    <p className="font-semibold text-white">
                      #{String(order.id).slice(-8)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {order.quantity} ticket{order.quantity === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="truncate">{order.eventName || "Event"}</span>
                  <span>{getBookingDate(order)}</span>
                  <span className="font-semibold text-white">
                    ₹{Number(order.total || 0)}
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusStyle(order.status)}`}
                    >
                      {order.status || "confirmed"}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center">
            <p className="text-lg font-semibold">No orders yet</p>
            <p className="mt-2 text-sm text-gray-400">
              Your confirmed event purchases will appear here.
            </p>
            <Link
              to="/events"
              className="mt-5 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              Explore Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
