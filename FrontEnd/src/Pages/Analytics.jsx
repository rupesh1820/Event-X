import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("eventxToken") || ""}` },
});

const Analytics = () => {
  const [data, setData] = useState({ events: [], bookings: [], stats: {} });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/api/creator/overview`, authConfig())
      .then((response) => setData(response.data))
      .catch((error) => setMessage(error.response?.data?.message || "Unable to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const confirmedBookings = data.bookings.filter((booking) => booking.status === "confirmed" || booking.status === "completed");
  const eventPerformance = useMemo(() => data.events.map((event) => {
    const eventBookings = confirmedBookings.filter((booking) => String(booking.eventId) === String(event._id));
    return {
      ...event,
      tickets: eventBookings.reduce((sum, booking) => sum + Number(booking.quantity || 0), 0),
      revenue: eventBookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0),
    };
  }).sort((first, second) => second.revenue - first.revenue), [data.events, confirmedBookings]);
  const maxRevenue = Math.max(...eventPerformance.map((event) => event.revenue), 1);
  const stats = data.stats || {};

  const exportReport = () => {
    const report = [
      "EVENTX CREATOR ANALYTICS",
      `Revenue: Rs. ${stats.revenue || 0}`,
      `Tickets sold: ${stats.ticketsSold || 0}`,
      `Attendees: ${stats.attendees || 0}`,
      ...eventPerformance.map((event) => `${event.title}: ${event.tickets} tickets, Rs. ${event.revenue}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "eventx-creator-analytics.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout organizer title="Event Analytics">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-2xl font-bold sm:text-3xl">Event Analytics</h2><p className="mt-1 text-sm text-gray-400">Real performance from your event bookings.</p></div><button type="button" onClick={exportReport} disabled={!eventPerformance.length} className="rounded-lg border border-violet-500/40 px-4 py-2 text-sm text-violet-300 disabled:opacity-40">↓ Export Report</button></div>
        {message && <p className="text-sm text-red-300">{message}</p>}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Total Revenue", `₹${Number(stats.revenue || 0).toLocaleString("en-IN")}`], ["Tickets Sold", stats.ticketsSold || 0], ["Total Attendees", stats.attendees || 0], ["Events", stats.events || 0]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-[#10131d] p-4"><p className="text-xs text-gray-400">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div>)}</div>
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5"><h3 className="font-semibold">Event Performance</h3>{loading ? <p className="mt-5 text-sm text-gray-500">Loading analytics...</p> : eventPerformance.length ? <div className="mt-5 space-y-4">{eventPerformance.map((event) => <div key={event._id}><div className="flex justify-between gap-3 text-sm"><span className="truncate">{event.title}</span><span className="text-violet-300">₹{event.revenue} · {event.tickets} tickets</span></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.max((event.revenue / maxRevenue) * 100, event.revenue ? 4 : 0)}%` }} /></div></div>)}</div> : <p className="mt-5 text-sm text-gray-500">No event analytics yet.</p>}</section>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
