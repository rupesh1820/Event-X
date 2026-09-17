import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CategoryEvents = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL =
    import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com";

  const selectedCategory = decodeURIComponent(category || "");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${API_URL}/api/events`);

        const eventList = Array.isArray(res.data.events)
          ? res.data.events
          : [];

        const filteredEvents = eventList.filter((event) => {
          const eventCategory = String(event.category || "")
            .trim()
            .toLowerCase();

          return (
            eventCategory === selectedCategory.trim().toLowerCase()
          );
        });

        setEvents(filteredEvents);
      } catch (err) {
        console.error("Category events error:", err);
        setError("Unable to load events.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [API_URL, selectedCategory]);

  const getEventTitle = (event) => {
    return event.title || event.eventName || event.name || "Untitled Event";
  };

  const getEventImage = (event) => {
    return (
      event.image ||
      event.imageUrl ||
      event.bannerImage ||
      "/Banner.jpeg"
    );
  };

  const getEventDate = (event) => {
    const eventDate = event.date || event.eventDate || event.startDate;

    if (!eventDate) {
      return "Date not available";
    }

    const date = new Date(eventDate);

    if (Number.isNaN(date.getTime())) {
      return eventDate;
    }

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventLocation = (event) => {
    return (
      event.location ||
      event.venue ||
      event.address ||
      "Location not available"
    );
  };

  const getEventPrice = (event) => {
    const price =
      event.price ??
      event.ticketPrice ??
      event.amount ??
      event.ticketAmount;

    if (price === undefined || price === null || price === "") {
      return "Price not available";
    }

    return Number(price) === 0 ? "Free" : `₹${price}`;
  };

  return (
    <main className="min-h-screen bg-[#080711] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
        >
          ← Back
        </button>

        <div className="mb-8">
          <p className="text-sm text-violet-400">
            Categories / {selectedCategory}
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            {selectedCategory} Events
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Explore all events available in this category.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-[#11111d] p-10 text-center text-gray-400">
            Loading events...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-500/20 bg-[#11111d] p-10 text-center text-red-400">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#11111d] p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Events Found
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Is category mein abhi koi event available nahi hai.
            </p>

            <button
              onClick={() => navigate("/category")}
              className="mt-5 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-700"
            >
              Back to Categories
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <article
                key={event._id}
                onClick={() =>
                  navigate(`/eventsdetail/${event._id}`)
                }
                className="group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-[#11111d] transition duration-300 hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={getEventImage(event)}
                    alt={getEventTitle(event)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs text-violet-300">
                    {selectedCategory}
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="line-clamp-2 text-lg font-semibold">
                    {getEventTitle(event)}
                  </h2>

                  <div className="mt-4 space-y-2 text-xs text-gray-400">
                    <p>📅 {getEventDate(event)}</p>

                    <p className="line-clamp-1">
                      📍 {getEventLocation(event)}
                    </p>

                    <p>💰 {getEventPrice(event)}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/eventsdetails/${event._id}`);
                    }}
                    className="mt-5 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryEvents;