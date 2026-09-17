import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const categoryStyles = {
Music: {
icon: "♫",
description: "Concerts, Festivals, Live Shows",
color: "bg-violet-600",
},
Workshop: {
icon: "▣",
description: "Skills, Learning & Bootcamps",
color: "bg-orange-500",
},
Sports: {
icon: "✦",
description: "Tournaments & Competitions",
color: "bg-emerald-500",
},
Culture: {
icon: "✿",
description: "Art, Dance & Traditional Events",
color: "bg-pink-500",
},
Business: {
icon: "▣",
description: "Networking & Conferences",
color: "bg-blue-500",
},
Technology: {
icon: "</>",
description: "Tech Talks & Hackathons",
color: "bg-cyan-500",
},
};

const defaultStyle = {
icon: "•••",
description: "Explore More Events",
color: "bg-purple-500",
};

const normalizeCategory = (category) => {
const value = String(category || "").trim().toLowerCase();

if (value === "cultural") return "Culture";

return (
Object.keys(categoryStyles).find(
(name) => name.toLowerCase() === value
) || "Other"
);
};

const CategoryCard = ({ category }) => (
  <article className="group overflow-hidden rounded-xl border border-white/10 bg-[#11111d] transition hover:-translate-y-1 hover:border-violet-500/70">
    <div className="relative h-32 overflow-hidden">
      <img
        src={category.image || "/Banner.jpeg"}
        alt={category.name}
        className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#11111d] to-transparent" />

      <span
        className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full ${category.color} text-lg font-bold`}
      >
        {category.icon}
      </span>
    </div>

    <div className="px-4 pb-4">
      <h3 className="font-semibold">{category.name}</h3>

      <p className="mt-1 text-xs text-gray-400">
        {category.description}
      </p>

      <p className="mt-4 text-xs text-gray-300">
        ▣ {category.count} Events
      </p>

      <NavLink
        to={`/events/category/${encodeURIComponent(category.name)}`}
        className="mt-4 block text-right text-xs text-violet-400 hover:text-violet-300"
      >
        View Events →
      </NavLink>
    </div>
  </article>
);

const Category = () => {
const API_URL = 
import.meta.env.VITE_SERVER || "http://localhost:5001"

const [events, setEvents] = useState([]);
const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
const [sortBy, setSortBy] = useState("Popular");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const fetchEvents = async () => {
try {
setLoading(true);
setError("");


    const res = await axios.get(`${API_URL}/api/events`);

    const eventList = Array.isArray(res.data.events)
      ? res.data.events
      : [];

    setEvents(eventList);
  } catch (error) {
    console.error("Error fetching categories:", error);
    setError("Unable to load categories.");
    setEvents([]);
  } finally {
    setLoading(false);
  }
};

fetchEvents();


}, [API_URL]);

const categories = useMemo(() => {
const categoryMap = {};


events.forEach((event) => {
  const name = normalizeCategory(event.category);
  const style = categoryStyles[name] || defaultStyle;

  if (!categoryMap[name]) {
    categoryMap[name] = {
      name,
      ...style,
      count: 0,
      image: event.image || event.imageUrl || "/Banner.jpeg",
    };
  }

  categoryMap[name].count += 1;
});

return Object.values(categoryMap);


}, [events]);

const filteredCategories = useMemo(() => {
const matchingCategories = categories.filter((category) =>
category.name.toLowerCase().includes(search.toLowerCase())
);


if (activeCategory !== "All") {
  return matchingCategories.filter(
    (category) => category.name === activeCategory
  );
}

return [...matchingCategories].sort((first, second) =>
  sortBy === "A-Z"
    ? first.name.localeCompare(second.name)
    : second.count - first.count
);


}, [activeCategory, categories, search, sortBy]);

const trendingCategories = useMemo(
() => [...categories].sort((a, b) => b.count - a.count).slice(0, 4),
[categories]
);

const totalEvents = events.length;

return ( <main className="min-h-screen overflow-hidden bg-[#080711] text-white">
{/* Hero */} <section className="relative border-b border-white/10"> <img
       src="/Banner.jpeg"
       alt="Live events"
       className="absolute inset-0 h-full w-full object-cover opacity-35"
     />


    <div className="absolute inset-0 bg-gradient-to-r from-[#080711] via-[#080711]/85 to-transparent" />

    <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-10">
      <p className="text-sm text-gray-400">
        ⌂ Home <span className="px-2">›</span>{" "}
        <span className="text-violet-400">Categories</span>
      </p>

      <h1 className="mt-6 text-4xl font-bold sm:text-5xl lg:text-6xl">
        Event <span className="text-violet-500">Categories</span>
      </h1>

      <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
        Explore events across different interests and find what excites you the most.
      </p>
    </div>
  </section>

  {/* Search and Filters */}
  <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
    <div className="flex flex-col gap-3 lg:flex-row">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-gray-400 focus-within:border-violet-500">
        <span>⌕</span>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search categories..."
          className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-gray-500"
        />
      </label>

      <select
        value={sortBy}
        onChange={(event) => setSortBy(event.target.value)}
        className="rounded-xl border border-white/15 bg-[#12111d] px-4 py-3 text-sm text-white outline-none"
      >
        <option value="Popular">♧ Sort by: Popular</option>
        <option value="A-Z">Sort by: A-Z</option>
      </select>
    </div>

    <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
      {["All", ...categories.map((category) => category.name)].map(
        (category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
              activeCategory === category
                ? "border-violet-500 bg-violet-600 text-white"
                : "border-white/15 text-gray-300 hover:border-violet-400"
            }`}
          >
            {category}
          </button>
        )
      )}
    </div>
  </section>

  {/* Browse Categories */}
  <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">Browse Categories</h2>

      <span className="text-xs text-violet-400">
        {filteredCategories.reduce(
          (total, category) => total + category.count,
          0
        )}{" "}
        Events
      </span>
    </div>

    {loading ? (
      <div className="rounded-xl border border-white/10 bg-[#11111d] p-10 text-center text-gray-400">
        Loading categories...
      </div>
    ) : error ? (
      <div className="rounded-xl border border-red-500/20 bg-[#11111d] p-10 text-center text-red-400">
        {error}
      </div>
    ) : filteredCategories.length === 0 ? (
      <div className="rounded-xl border border-white/10 bg-[#11111d] p-10 text-center text-gray-400">
        No categories found.
      </div>
    ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCategories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    )}
  </section>

  {/* Trending */}
  <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold">Trending Categories 🔥</h2>

      <NavLink
        to="/events"
        className="text-xs text-violet-400"
      >
        View All →
      </NavLink>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trendingCategories.map((category, index) => (
        <div
          key={category.name}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-[#11111d] p-4"
        >
          <img
            src={category.image || "/Banner.jpeg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />

          <div className="relative">
            <span className="rounded-full border border-white/20 bg-black/40 px-2 py-1 text-xs">
              #{index + 1}
            </span>

            <h3 className="mt-8 font-semibold">
              {category.name} Events
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              {category.count}+ Events
            </p>
          </div>
        </div>
      ))}
    </div>
  </section>

  {/* CTA */}
  <section className="mx-auto mb-12 flex max-w-7xl flex-col items-start justify-between gap-5 rounded-2xl bg-gradient-to-r from-violet-700 to-purple-600 px-6 py-6 sm:flex-row sm:items-center sm:px-10">
    <div>
      <h2 className="text-xl font-bold">
        Can’t find your favorite category?
      </h2>

      <p className="mt-1 text-sm text-violet-100">
        Explore all events and discover something amazing.
      </p>
    </div>

    <NavLink
      to="/events"
      className="rounded-lg bg-black/70 px-5 py-3 text-sm font-semibold hover:bg-black"
    >
      Explore All Events →
    </NavLink>
  </section>
</main>


);
};

export default Category;
