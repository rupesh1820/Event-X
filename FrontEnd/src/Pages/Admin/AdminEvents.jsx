import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
  const token = localStorage.getItem("eventxToken");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/profile");
      return;
    }

    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/events`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
      }

      setEvents(data.events || []);
    } catch (error) {
      console.error("Fetch pending events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (eventId) => {
    try {
      setApprovingId(eventId);

      const response = await fetch(
        `${API_URL}/api/admin/events/${eventId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve event");
      }

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Approve event error:", error);
      alert(error.message);
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080812] text-white">
        Loading pending events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Events</h1>
            <p className="mt-2 text-gray-400">
              Review and approve creator event requests.
            </p>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm hover:bg-white/10"
          >
            Back
          </button>
        </div>

        {events.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-gray-400">
              No pending events available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-52 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">{event.title}</h2>

                    <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs text-yellow-300">
                      Pending
                    </span>
                  </div>

                  <p className="mb-4 text-sm leading-6 text-gray-400">
                    {event.shortDescription}
                  </p>

                  <div className="space-y-2 text-sm text-gray-300">
                    <p>
                      <span className="text-gray-500">Category:</span>{" "}
                      {event.category}
                    </p>

                    <p>
                      <span className="text-gray-500">Host:</span>{" "}
                      {event.hostName}
                    </p>

                    <p>
                      <span className="text-gray-500">City:</span>{" "}
                      {event.city}
                    </p>

                    <p>
                      <span className="text-gray-500">Date:</span>{" "}
                      {event.date}
                    </p>

                    <p>
                      <span className="text-gray-500">Time:</span>{" "}
                      {event.time}
                    </p>

                    <p>
                      <span className="text-gray-500">Created by:</span>{" "}
                      {event.creatorId?.fullName || "Unknown creator"}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApprove(event._id)}
                    disabled={approvingId === event._id}
                    className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 font-semibold transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {approvingId === event._id
                      ? "Approving..."
                      : "Approve Event"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;