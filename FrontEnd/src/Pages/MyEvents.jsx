import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_SERVER 

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const token = localStorage.getItem("eventxToken");

        const response = await fetch(`${API_URL}/api/my-events`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch events");
        }

        setEvents(data.events || []);
      } catch (error) {
        console.error("Fetch my events error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080711] text-white flex items-center justify-center">
        Loading your events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] text-white px-5 py-10 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-gray-400 mt-2">
              Manage events created by you
            </p>
          </div>

          <Link
            to="/create-event"
            className="bg-violet-600 hover:bg-violet-700 px-5 py-3 rounded-xl font-semibold transition"
          >
            Create Event
          </Link>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        {!error && events.length === 0 ? (
          <div className="bg-[#171622] border border-gray-800 rounded-2xl p-10 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No events created yet
            </h2>

            <p className="text-gray-400 mb-5">
              Create your first event to see it here.
            </p>

            <Link
              to="/create-event"
              className="inline-block bg-violet-600 hover:bg-violet-700 px-5 py-3 rounded-xl"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const status = String(
                event.status || event.approvalStatus || "pending"
              ).toLowerCase();

              return (
                <div
                  key={event._id}
                  className="bg-[#171622] border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-600 transition"
                >
                  <img
                    src={event.imageUrl || "/event-placeholder.jpg"}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">
                      {event.title}
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    <div className="space-y-2 text-sm text-gray-300">
                      <p>📍 {event.city || event.venueName}</p>
                      <p>📅 {event.date}</p>
                      <p>⏰ {event.time}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs capitalize ${
                          status === "approved"
                            ? "bg-green-500/15 text-green-400"
                            : status === "rejected"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        {status}
                      </span>

                      <Link
                        to={`/eventsdetails/${event._id}`}
                        className="text-violet-400 hover:text-violet-300 font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;