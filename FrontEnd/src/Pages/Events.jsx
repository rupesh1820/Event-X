import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CATEGORIES = [
{ name: "Music", icon: "🎵" },
{ name: "Workshop", icon: "💻" },
{ name: "Sports", icon: "🏆" },
{ name: "Culture", icon: "🎭" },
{ name: "Business", icon: "💼" },
{ name: "Technology", icon: "💡" },
];

const categoryIcons = Object.fromEntries(
CATEGORIES.map((category) => [category.name, category.icon])
);

const normalizeCategory = (category) => {
const value = String(category || "").trim().toLowerCase();

if (value === "cultural") return "Culture";

return CATEGORIES.find(
(item) => item.name.toLowerCase() === value
)?.name || "Other";
};

const readSavedWishlist = () => {
try {
const savedIds = JSON.parse(
localStorage.getItem("eventxWishlist") || "[]"
);


return Array.isArray(savedIds) ? savedIds.map(String) : [];


} catch {
return [];
}
};

const Events = () => {
const API_URL = 
import.meta.env.VITE_SERVER || "https://event-x-backend.onrender.com"


const [favoriteEvents, setFavoriteEvents] = useState(readSavedWishlist);
const [eve, setEve] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [viewMode, setViewMode] = useState("grid");

const [search, setSearch] = useState("");
const [maxPrice, setMaxPrice] = useState(5000);
const [sortBy, setSortBy] = useState("Upcoming First");

const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    maxPrice: 5000,
  });

const eventsPerPage = 20;

useEffect(() => {
const fetchData = async () => {
try {
const res = await axios.get(`${API_URL}/api/events`);


    const eventList = Array.isArray(res.data.events)
      ? res.data.events
      : [];

    const formattedEvents = eventList.map((event) => ({
      id: event._id,
      name: event.title || "Untitled Event",
      category: normalizeCategory(event.category),
      image: event.image || event.imageUrl,
      location: [event.venueName, event.city]
        .filter(Boolean)
        .join(", ") || "Location not available",
      date: event.date,
      availableTickets: event.maxCapacity,
      price: Number(event.ticketPrice) || 0,
    }));

    setEve(formattedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    setEve([]);
  }
};

fetchData();


}, [API_URL]);

const toggleFavorite = (eventId) => {
setFavoriteEvents((currentFavorites) => {
const normalizedId = String(eventId);


  const updatedFavorites = currentFavorites.includes(normalizedId)
    ? currentFavorites.filter((id) => id !== normalizedId)
    : [...currentFavorites, normalizedId];

  localStorage.setItem(
    "eventxWishlist",
    JSON.stringify(updatedFavorites)
  );

  return updatedFavorites;
});


};

const categoryCounts = useMemo(() => {
const counts = Object.fromEntries(
CATEGORIES.map((item) => [item.name, 0])
);


counts.Other = 0;

eve.forEach((event) => {
  counts[event.category] = (counts[event.category] || 0) + 1;
});

return counts;


}, [eve]);

const filteredEvents = useMemo(() => {
    const query = appliedFilters.search.trim().toLowerCase();

    const result = eve.filter((event) => {
      const eventName = String(event.name || "").toLowerCase();
      return (
        eventName.includes(query) &&
        event.price <= appliedFilters.maxPrice
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "Price: low to high") return a.price - b.price;
      if (sortBy === "Price: high to low") return b.price - a.price;
      if (sortBy === "Newest First") return String(b.id).localeCompare(String(a.id));
      if (sortBy === "Most Popular") return (b.availableTickets || 0) - (a.availableTickets || 0);
      return new Date(a.date || 0) - new Date(b.date || 0);
    });
  }, [eve, appliedFilters.search, appliedFilters.maxPrice, sortBy]);

  const searchSuggestions = useMemo(() => {
  const query = search.trim().toLowerCase();

  if (!query) return [];

  return eve
    .filter((event) => {
      const name = String(event.name || "").toLowerCase();
      return name.includes(query);
    })
    .slice(0, 6);
}, [eve, search]);

const totalPages = Math.max(
1,
Math.ceil(filteredEvents.length / eventsPerPage)
);

const pageNumbers = Array.from(
{ length: totalPages },
(_, index) => index + 1
);

const visibleEvents = filteredEvents.slice(
(currentPage - 1) * eventsPerPage,
currentPage * eventsPerPage
);

const applyFilters = () => {
    setAppliedFilters({
      search,
      maxPrice,
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setMaxPrice(5000);
    setSortBy("Upcoming First");
    setAppliedFilters({
      search: "",
      maxPrice: 5000,
    });
    setCurrentPage(1);
  };

  return ( <div className="min-h-screen bg-[#080711] text-white">
{/* Hero */} <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:px-10 lg:pt-20"> <div> <h1 className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
Explore <span className="text-violet-500">Events</span> </h1>


      <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
        Discover and register for amazing events happening around you.
      </p>
    </div>

    <div className="relative h-72 overflow-hidden rounded-2xl border border-violet-900/40 sm:h-96 lg:h-[430px]">
      <img
        src="/Banner.jpeg"
        alt="Live event audience"
        className="h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#080711] via-transparent to-transparent" />
    </div>
  </section>

  {/* Search */}
<div className="bg-[#0D0E18] px-4 py-4 shadow-2xl sm:px-6 lg:px-8">
  <div className="relative mx-auto max-w-3xl">
    <input
      type="text"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setAppliedFilters((previous) => ({ ...previous, search: e.target.value }));
        setCurrentPage(1);
      }}
      onKeyDown={(e) => { if (e.key === "Enter") applyFilters(); }}
      placeholder="Search event by name..."
      className="w-full rounded-lg border border-gray-700 bg-transparent px-4 py-3 text-white placeholder:text-gray-500 focus:border-violet-500 focus:outline-none"
    />
    {search.trim() && (
      <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-700 bg-[#11121D] shadow-2xl">
        {searchSuggestions.length > 0 ? searchSuggestions.map((event) => (
          <button key={event.id} type="button" onClick={() => { setSearch(event.name); setAppliedFilters((previous) => ({ ...previous, search: event.name })); setCurrentPage(1); }} className="flex w-full items-center gap-3 border-b border-gray-800 px-4 py-3 text-left hover:bg-violet-600/10">
            <img src={event.image || "/Banner.jpeg"} alt="" className="h-10 w-14 rounded object-cover" />
            <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{event.name}</p><p className="mt-1 truncate text-xs text-gray-400">{event.location}</p></div>
          </button>
        )) : <div className="px-4 py-4 text-sm text-gray-400">No matching events found.</div>}
      </div>
    )}
  </div>
</div>

{/* Main Content */}
  <div className="mx-auto my-6 flex max-w-7xl flex-col gap-6 px-4 sm:my-10 sm:px-6 lg:flex-row lg:px-8">
    {/* Left Sidebar */}
    <aside className="w-full rounded-2xl bg-[#0D0E18] px-4 sm:px-5 lg:w-[30%]">
      <div className="flex items-center justify-between py-5">
        <div className="text-2xl sm:text-3xl">Filters</div>

        <button
          onClick={resetFilters}
          className="cursor-pointer text-blue-500 hover:text-blue-400"
        >
          Reset
        </button>
      </div>

      {/* Category */}
      <div className="border-b border-gray-800 px-2 py-4">
        <h1 className="mb-3">Category</h1>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => {
                setSearch(category.name);
                setAppliedFilters((previous) => ({
                  ...previous,
                  search: category.name,
                }));
                setCurrentPage(1);
              }}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-gray-300 transition hover:bg-violet-600/10 hover:text-white"
            >
              <span>
                {category.icon} {category.name}
              </span>
              <span className="text-gray-500">
                {categoryCounts[category.name] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-2 px-2 py-4">
        <h1>Price Range</h1>

        <input
          type="range"
          min="0"
          max="5000"
          step="100"
          value={maxPrice}
          onChange={(e) => {
            const value = Number(e.target.value);
            setMaxPrice(value);
            setAppliedFilters((previous) => ({ ...previous, maxPrice: value }));
            setCurrentPage(1);
          }}
          className="w-full accent-violet-600"
        />

        <div className="flex justify-between text-sm text-gray-300">
          <span>₹0</span>
          <span>₹{maxPrice}+</span>
        </div>
      </div>

    </aside>

    {/* Events */}
    <main className="w-full lg:w-[70%]">
      <div className="flex flex-col gap-4 px-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
        <h1>
          <span className="text-blue-500">
            {filteredEvents.length}
          </span>{" "}
          Events Found
        </h1>

        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span>Sort by:</span>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="h-8 rounded border border-gray-600 bg-[#0D0E18] text-white"
            >
              <option>Upcoming First</option>
              <option>Price: low to high</option>
              <option>Price: high to low</option>
              <option>Most Popular</option>
              <option>Newest First</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm sm:text-base">
            <span>View:</span>

            <div className="flex gap-1 rounded-lg border border-gray-700 p-1">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`rounded px-2 py-1 text-xl leading-none transition ${
                  viewMode === "grid"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ⊞
              </button>

              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`rounded px-2 py-1 text-xl leading-none transition ${
                  viewMode === "list"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Event Cards */}
      {visibleEvents.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-[#0D0E18] px-5 py-16 text-center">
          <p className="text-xl font-semibold">No events found</p>
          <p className="mt-2 text-gray-400">
            Try changing your search or filters.
          </p>

          <button
            onClick={resetFilters}
            className="mt-5 rounded-lg bg-violet-600 px-5 py-2 hover:bg-violet-500"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col"
          } gap-4 px-0 sm:gap-5 lg:px-5`}
        >
          {visibleEvents.map((e) => (
            <Link
              to={`/eventsdetails/${e.id}`}
              key={e.id}
              className={`${
                viewMode === "list" ? "flex flex-row" : ""
              } group block overflow-hidden rounded-lg border border-transparent bg-gray-800 shadow-lg transition duration-300 ease-out hover:-translate-y-1 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-950/40`}
            >
              <div
                className={`relative overflow-hidden ${
                  viewMode === "list" ? "w-32 shrink-0 sm:w-56" : ""
                }`}
              >
                <img
                  src={e.image || "/Banner.jpeg"}
                  alt={e.name}
                  className={`${
                    viewMode === "list"
                      ? "h-full min-h-32"
                      : "h-52 sm:h-48"
                  } w-full object-cover transition duration-500 group-hover:scale-105`}
                />

                <span className="absolute left-3 top-3 max-w-[calc(100%-4rem)] truncate rounded-full bg-violet-600 px-3 py-1 text-sm font-semibold text-white shadow-lg">
                  {categoryIcons[e.category] || "📌"} {e.category}
                </span>

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    toggleFavorite(e.id);
                  }}
                  aria-label={`${
                    favoriteEvents.includes(String(e.id))
                      ? "Remove"
                      : "Add"
                  } ${e.name} ${
                    favoriteEvents.includes(String(e.id))
                      ? "from"
                      : "to"
                  } wishlist`}
                  className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-2xl leading-none transition hover:scale-110 hover:bg-black/75 ${
                    favoriteEvents.includes(String(e.id))
                      ? "text-pink-500"
                      : "text-white"
                  }`}
                >
                  {favoriteEvents.includes(String(e.id)) ? "♥" : "♡"}
                </button>
              </div>

              <div
                className={`${
                  viewMode === "list"
                    ? "min-w-0 flex-1 p-3 sm:p-4"
                    : "p-4"
                }`}
              >
                <h2 className="text-base font-bold text-white transition-colors group-hover:text-violet-300 sm:text-xl">
                  {e.name}
                </h2>

                <p className="mt-1 text-gray-400">{e.location}</p>

                <p className="mt-1 text-gray-400">{e.date}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm">
                    Tickets Left: {e.availableTickets ?? "N/A"}
                  </span>

                  <p className="font-bold text-blue-500">
                    ₹{e.price}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-violet-300">
                    View details
                  </span>

                  <span className="text-lg text-white">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className="rounded-lg border border-gray-700 px-4 py-2 transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`h-9 min-w-9 rounded-lg px-3 transition ${
                currentPage === page
                  ? "bg-violet-600"
                  : "border border-gray-700 hover:border-violet-500"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className="rounded-lg border border-gray-700 px-4 py-2 transition hover:border-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  </div>
</div>


);
};

export default Events;
