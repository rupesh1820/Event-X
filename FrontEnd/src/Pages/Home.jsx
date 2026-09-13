import { Link } from "react-router-dom";

const Home = () => {




  const categories = [
    ["Music", "128 Events", "♪", "bg-violet-600"],
    ["Workshops", "96 Events", "◇", "bg-orange-500"],
    ["Sports", "78 Events", "↗", "bg-green-500"],
    ["Cultural", "62 Events", "◇", "bg-pink-500"],
    ["Business", "86 Events", "▣", "bg-blue-500"],
    ["Others", "45 Events", "•••", "bg-violet-600"],
  ];

  const events = [
    ["Summer Music Festival", "Mumbai, India", "24 MAY", "₹499", "Music"],
    ["UI/UX Design Workshop", "Bangalore, India", "30 MAY", "₹299", "Workshop"],
    ["Inter College Football Cup", "Delhi, India", "05 JUN", "Free", "Sports"],
    ["Nritya Dance Showcase", "Pune, India", "12 JUN", "₹199", "Cultural"],
  ];
  return (
    <main className="min-h-screen bg-[#080711] text-white">
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-6 pb-10 pt-16 lg:grid-cols-2 lg:px-10 lg:pt-20">
        <div>
          <h1 className="max-w-xl text-5xl font-bold leading-tight sm:text-6xl">
            Discover Events.
            <br />
            Experience <span className="text-violet-500">More.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
            Find and register for the best events happening around you. Connect,
            learn and grow.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <button className="rounded-lg bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500">
              Explore Events
            </button>
            <button className="rounded-lg border border-gray-500 px-6 py-3 font-semibold hover:border-violet-400">
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

      <section className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 rounded-xl bg-white p-4 text-gray-500 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <textarea
            name=""
            id=""
            placeholder="Search events, workshops..."
            className="bg-transparent text-gray-500 placeholder:text-gray-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Enter your city"
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            placeholder="Select date"
            className="border rounded px-3 py-2 text-black"
          />

          <span>
            ▦ Category
            <br />
            <small>All Categories</small>
          </span>
          <button className="rounded-lg bg-violet-600 px-8 py-3 font-semibold text-white">
            Search
          </button>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-bold">Browse by Categories</h2>
          <button className="text-sm text-gray-300">
            View all categories →
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map(([name, count, icon, color]) => (
            <div key={name} className="group cursor-pointer rounded-lg border border-transparent bg-[#171622] p-4 text-center transition duration-300 ease-out hover:-translate-y-2 hover:border-violet-500/50 hover:bg-[#1d1b2b] hover:shadow-xl hover:shadow-violet-950/40 focus-within:-translate-y-2 focus-within:border-violet-500/50">
              <div
                className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold transition duration-300 group-hover:scale-110 group-hover:rotate-6 ${color}`}
              >
                {icon}
              </div>
              <div className="mt-3 font-semibold">{name}</div>
              <div className="text-xs text-gray-400">{count}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-xl font-bold">Featured Events</h2>
          <button className="text-sm text-gray-300">View all events →</button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {events.map(([name, place, date, price, type]) => (
            <article
              key={name}
              className="group overflow-hidden rounded-lg border border-gray-800 bg-[#171622] transition duration-300 ease-out hover:-translate-y-2 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-950/40 focus-within:-translate-y-2 focus-within:border-violet-500/60"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src="/Banner.jpeg"
                  alt={name}
                  className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded bg-violet-600 px-2 py-1 text-xs transition duration-300 group-hover:bg-violet-500">
                  {type}
                </span>
              </div>
              <div className="p-4">
                <div className="font-semibold">{name}</div>
                <div className="mt-2 text-xs text-gray-400">⌖ {place}</div>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-violet-400">{date}</span>
                  <strong className="text-violet-400">{price}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="my-12 grid grid-cols-2 gap-4 rounded-xl border border-gray-800 bg-[#171622] p-6 text-center sm:grid-cols-4">
          {[
            "1,200+|Events Hosted",
            "50K+|Happy Users",
            "200K+|Tickets Booked",
            "2K+|Active Organizers",
          ].map((stat) => {
            const [number, label] = stat.split("|");
            return (
              <div key={label} className="rounded-lg p-2 transition duration-300 hover:-translate-y-1 hover:bg-white/5">
                <div className="text-2xl font-bold text-violet-500">
                  {number}
                </div>
                <div className="mt-1 text-xs text-gray-400">{label}</div>
              </div>
            );
          })}
        </div>

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
    </main>
  );
};

export default Home;
