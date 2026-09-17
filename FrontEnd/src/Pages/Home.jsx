import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const API_URL =
    import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/https://eventx-backend-pq2m.onrender.com"

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/events`);

      if (!response.ok) {
        throw new Error("Events fetch nahi ho paaye");
      }

      const data = await response.json();

      const eventData = Array.isArray(data)
        ? data
        : data.events || data.data || [];

      setEvents(eventData);
      setFilteredEvents(eventData);
    } catch (error) {
      console.error("Home events error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEventName = (event) => {
    return event.title || event.eventName || event.name || "Untitled Event";
  };

  const getEventImage = (event) => {
    return (
      event.image ||
      event.bannerImage ||
      event.coverImage ||
      event.imageUrl ||
      "/Banner.jpeg"
    );
  };

  const getEventLocation = (event) => {
    return (
      event.location ||
      event.city ||
      event.venue ||
      event.address ||
      "Location not available"
    );
  };

  const getEventCategory = (event) => {
    return event.category || event.eventCategory || "Others";
  };

  const getEventPrice = (event) => {
    if (
      event.price === 0 ||
      event.ticketPrice === 0 ||
      event.amount === 0
    ) {
      return "Free";
    }

    const price = event.price || event.ticketPrice || event.amount;

    return price ? `₹${price}` : "Free";
  };

  const getEventDate = (event) => {
    const eventDate = event.date || event.eventDate || event.startDate;

    if (!eventDate) {
      return "DATE";
    }

    const dateObject = new Date(eventDate);

    if (Number.isNaN(dateObject.getTime())) {
      return "DATE";
    }

    return dateObject
      .toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
      .toUpperCase();
  };

  const handleSearch = () => {
    const query = search.trim().toLowerCase();

    const result = events.filter((event) => {
      const eventName = getEventName(event).toLowerCase();
      return !query || eventName.includes(query);
    });

    setFilteredEvents(result);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearch("");
    setFilteredEvents(events);
    setShowSearchResults(false);
  };

  // Live suggestions while typing
  const searchSuggestions =
    search.trim().length > 0
      ? events
          .filter((event) =>
            getEventName(event)
              .toLowerCase()
              .includes(search.trim().toLowerCase())
          )
          .slice(0, 6)
      : [];

  const handleSuggestionClick = (event) => {
    const eventId = event._id || event.id;

    if (!eventId) return;

    setSearch(getEventName(event));
    setShowSearchResults(false);
    navigate(`/eventsdetails/${eventId}`);
  };

  return (
    <main className="min-h-screen bg-[#080711] text-white">
      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-10 pt-16 lg:grid-cols-2 lg:px-10 lg:pt-20">
        <div>
          <h1 className="max-w-xl text-5xl font-bold leading-tight sm:text-6xl">
            Discover Events.
            <br />
            Experience <span className="text-violet-500">More.</span>
          </h1>

          <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
            Find and register for the best events happening around you.
            Connect, learn and grow.
          </p>

          <div className="mt-7 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/events")}
              className="rounded-lg bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500"
            >
              Explore Events
            </button>

            <button
              onClick={() => navigate("/events")}
              className="rounded-lg border border-gray-500 px-6 py-3 font-semibold hover:border-violet-400"
            >
              ▷ &nbsp; Watch Demo
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-300">
            <span className="text-violet-400">● ● ● ●</span> &nbsp; Join{" "}
            <span className="text-violet-400">10,000+</span> happy event goers
          </div>
        </div>

        <div className="relative h-72 overflow-hidden rounded-2xl border border-violet-900/40 sm:h-96 lg:h-108">
          <img
            src="/Banner.jpeg"
            alt="Live event audience"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-[#080711] via-transparent to-transparent" />
        </div>
      </section>

      {/* Search Section */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="relative flex flex-col gap-4 rounded-xl bg-white p-4 text-gray-500 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSearchResults(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search events, workshops..."
              className="w-full bg-transparent text-gray-700 placeholder:text-gray-500 focus:outline-none"
            />

            {search.trim() && (
              <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                {searchSuggestions.length > 0 ? (
                  <div className="py-1">
                    {searchSuggestions.map((event) => (
                      <button
                        key={event._id || event.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(event)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-violet-50"
                      >
                        <img
                          src={getEventImage(event)}
                          alt={getEventName(event)}
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/Banner.jpeg";
                          }}
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {getEventName(event)}
                          </p>
                          <p className="mt-1 truncate text-xs text-gray-500">
                            {getEventLocation(event)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No matching events found
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="rounded-lg bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-500"
          >
            Search
          </button>
        </div>

        {/* Featured Events */}
        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Events</h2>

          <button
            onClick={() => navigate("/events")}
            className="text-sm text-gray-300 hover:text-violet-400"
          >
            View all events →
          </button>
        </div>

        {loading ? (
          <div className="py-10 text-center text-gray-400">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            No events found.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {events.slice(0, 4).map((event) => (
              <article
                key={event._id || event.id}
                onClick={() =>
                  navigate(`/eventsdetails/${event._id || event.id}`)
                }
                className="group cursor-pointer overflow-hidden rounded-lg border border-gray-800 bg-[#171622] transition duration-300 ease-out hover:-translate-y-2 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-950/40"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={getEventImage(event)}
                    alt={getEventName(event)}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = "/Banner.jpeg";
                    }}
                  />

                  <span className="absolute left-3 top-3 rounded bg-violet-600 px-2 py-1 text-xs transition duration-300 group-hover:bg-violet-500">
                    {getEventCategory(event)}
                  </span>
                </div>

                <div className="p-4">
                  <div className="line-clamp-2 font-semibold">
                    {getEventName(event)}
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    ⌖ {getEventLocation(event)}
                  </div>

                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-violet-400">
                      {getEventDate(event)}
                    </span>

                    <strong className="text-violet-400">
                      {getEventPrice(event)}
                    </strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="my-12 grid grid-cols-2 gap-4 rounded-xl border border-gray-800 bg-[#171622] p-6 text-center sm:grid-cols-4">
          {[
            `${events.length}+|Events Hosted`,
            "50K+|Happy Users",
            "200K+|Tickets Booked",
            "2K+|Active Organizers",
          ].map((stat) => {
            const [number, label] = stat.split("|");

            return (
              <div
                key={label}
                className="rounded-lg p-2 transition duration-300 hover:-translate-y-1 hover:bg-white/5"
              >
                <div className="text-2xl font-bold text-violet-500">
                  {number}
                </div>

                <div className="mt-1 text-xs text-gray-400">{label}</div>
              </div>
            );
          })}
        </div>

        {/* Organizer Section */}
        <div className="mb-12 flex flex-col gap-6 rounded-xl border border-violet-800 bg-linear-to-r from-violet-950 to-violet-700 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500 text-3xl">
              ♢
            </div>

            <div>
              <h2 className="text-2xl font-bold">Organizing an Event?</h2>

              <p className="mt-1 text-sm text-violet-100">
                Create, manage and promote your events with EventX.
              </p>
            </div>
          </div>

          <Link
            to="/signup?role=creator"
            className="rounded-lg bg-[#080711] px-6 py-3 font-semibold text-white hover:bg-black"
          >
            Become an Organizer →
          </Link>
        </div>
      </section>

      {showSearchResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-violet-500/30 bg-[#11101d] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
                <p className="mt-1 text-sm text-gray-400">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
                </p>
              </div>
              <button onClick={() => setShowSearchResults(false)} className="rounded-full px-3 py-1 text-2xl text-gray-400 hover:bg-white/10 hover:text-white">×</button>
            </div>

            {events.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                No events found. Try another event name.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((event) => (
                  <article key={event._id || event.id} onClick={() => navigate(`/eventsdetails/${event._id || event.id}`)} className="cursor-pointer overflow-hidden rounded-xl border border-gray-800 bg-[#171622] transition hover:-translate-y-1 hover:border-violet-500/60">
                    <img src={getEventImage(event)} alt={getEventName(event)} className="h-40 w-full object-cover" onError={(e) => { e.currentTarget.src = "/Banner.jpeg"; }} />
                    <div className="p-4">
                      <p className="text-xs text-violet-400">{getEventCategory(event)}</p>
                      <h3 className="mt-1 line-clamp-2 font-semibold text-white">{getEventName(event)}</h3>
                      <p className="mt-2 text-xs text-gray-400">⌖ {getEventLocation(event)}</p>
                      <div className="mt-3 flex justify-between text-sm">
                        <span className="text-violet-400">{getEventDate(event)}</span>
                        <span className="font-semibold text-violet-400">{getEventPrice(event)}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={clearSearch} className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:border-violet-400">Clear Filters</button>
              <button onClick={() => navigate("/events")} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500">View All Events</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;