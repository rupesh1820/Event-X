import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";

const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001";

const readWishlistIds = () => {
  try {
    const savedIds = JSON.parse(
      localStorage.getItem("eventxWishlist") || "[]",
    );
    return Array.isArray(savedIds) ? savedIds.map(String) : [];
  } catch {
    return [];
  }
};

const SavedEvents = () => {
  const [events, setEvents] = useState([]);
  const [savedIds, setSavedIds] = useState(readWishlistIds);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/events`);
        const eventList = Array.isArray(response.data.events)
          ? response.data.events
          : [];

        if (isMounted) {
          setEvents(
            eventList.map((event) => ({
              id: event._id,
              name: event.title,
              category: event.category,
              image: event.image || event.imageUrl,
              location: [event.venueName, event.city]
                .filter(Boolean)
                .join(", "),
              date: event.date,
              time: event.time,
              price: event.ticketPrice || 0,
            })),
          );
        }
      } catch (error) {
        console.error("Saved events fetch error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  const savedEvents = events.filter((event) =>
    savedIds.includes(String(event.id)),
  );

  const removeSavedEvent = (eventId) => {
    const updatedIds = savedIds.filter(
      (id) => String(id) !== String(eventId),
    );
    setSavedIds(updatedIds);
    localStorage.setItem("eventxWishlist", JSON.stringify(updatedIds));
  };

  return (
    <DashboardLayout title="Saved Events">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Saved Events</h2>
            <p className="mt-1 text-sm text-gray-400">
              All your bookmarked experiences in one place.
            </p>
          </div>
          <Link
            to="/events"
            className="text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            View all events
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
            Loading your saved events...
          </div>
        ) : savedEvents.length ? (
          <div className="space-y-4">
            {savedEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#10131d] p-4 sm:flex-row sm:items-center"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-40 w-full rounded-xl object-cover sm:h-28 sm:w-36"
                  />
                ) : (
                  <div className="grid h-40 w-full place-items-center rounded-xl bg-violet-950 text-sm text-violet-200 sm:h-28 sm:w-36">
                    No image
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.22em] text-violet-300">
                      {event.category}
                    </p>
                    <h3 className="mt-1 truncate text-lg font-bold text-white">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {event.location || "Location unavailable"} · {event.date || "Date unavailable"} · {event.time || "Time unavailable"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="text-lg font-semibold text-violet-400">
                      ₹{event.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSavedEvent(event.id)}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-pink-400 hover:text-pink-300"
                    >
                      Remove
                    </button>
                    <Link
                      to={`/payment/${event.id}`}
                      className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500 hover:text-white"
                    >
                      Reserve
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center">
            <p className="text-lg font-semibold">No saved events</p>
            <p className="mt-2 text-sm text-gray-400">
              Save events from the Events page to see them here.
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
    </DashboardLayout>
  );
};

export default SavedEvents;
