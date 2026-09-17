import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


 const API_URL = import.meta.env.VITE_SERVER || "http://localhost:5001"
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

const Wishlist = () => {
  const [events, setEvents] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(readWishlistIds);
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
        console.error("Wishlist events error:", error);
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
    wishlistIds.includes(String(event.id)),
  );

  const removeFromWishlist = (eventId) => {
    const updatedIds = wishlistIds.filter(
      (id) => String(id) !== String(eventId),
    );
    setWishlistIds(updatedIds);
    localStorage.setItem("eventxWishlist", JSON.stringify(updatedIds));
  };

  return (
    <div title="Wishlist">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Wishlist</h2>
            <p className="mt-1 text-sm text-gray-400">
              Events you saved for later.
            </p>
          </div>
          <Link
            to="/events"
            className="text-sm font-medium text-violet-400 hover:text-violet-300"
          >
            Browse events
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10131d] px-6 py-12 text-center text-gray-400">
            Loading your wishlist...
          </div>
        ) : savedEvents.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {savedEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#10131d] p-4 sm:flex-row"
              >
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-44 w-full rounded-xl object-cover sm:h-28 sm:w-28"
                  />
                ) : (
                  <div className="grid h-44 w-full place-items-center rounded-xl bg-violet-950 text-sm text-violet-200 sm:h-28 sm:w-28">
                    No image
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.2em] text-violet-300">
                          {event.category}
                        </p>
                        <h3 className="mt-1 truncate text-lg font-bold text-white">
                          {event.name}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(event.id)}
                        aria-label={`Remove ${event.name} from wishlist`}
                        className="text-xl text-pink-400 hover:text-pink-300"
                      >
                        ♥
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-400">
                      📍 {event.location || "Location unavailable"}
                    </p>
                    <p className="text-sm text-gray-400">
                      🗓️ {event.date || "Date unavailable"} · {event.time || "Time unavailable"}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="font-semibold text-violet-400">
                      ₹{event.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => removeFromWishlist(event.id)}
                        className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 hover:border-pink-400 hover:text-pink-300"
                      >
                        Remove
                      </button>
                      <Link
                        to={`/payment/${event.id}`}
                        className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 bg-[#10131d] px-6 py-12 text-center">
            <p className="text-lg font-semibold">Your wishlist is empty</p>
            <p className="mt-2 text-sm text-gray-400">
              Save events from the Events page to find them here.
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

export default Wishlist;
