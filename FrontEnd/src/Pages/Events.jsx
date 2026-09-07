import { useState } from "react";
import { events } from "../Data/Data";

const categoryIcons = {
  Music: "🎵",
  Workshop: "💻",
  Sports: "🏆",
  Cultural: "🎭",
  Business: "💼",
  Technology: "💡",
};

const Events = () => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const eventsPerPage = 20;

  const toggleFavorite = (eventId) => {
    setFavoriteEvents((currentFavorites) =>
      currentFavorites.includes(eventId)
        ? currentFavorites.filter((id) => id !== eventId)
        : [...currentFavorites, eventId]
    );
  };

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const visibleEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div>
      <div>
        {" "}
        <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-2 lg:px-10 lg:pt-20">
          <div>
            <h1 className="max-w-xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Explore <span className="text-violet-800">Events</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-gray-300">
              Discover and register for amazing events happening around you.
            </p>
           
            
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
      </div>
      <div className="grid gap-3 bg-[#0D0E18] px-4 py-4 text-gray-500 shadow-2xl sm:grid-cols-2 sm:px-6 lg:grid-cols-6 lg:px-8">
          <input
          type="text"
            name=""
            id=""
            placeholder="Search events, workshops..."
            className="w-full rounded border bg-transparent px-3 py-2 text-gray-500 placeholder:text-gray-500 focus:outline-none lg:col-span-2"
          />
          <input
            type="text"
            placeholder="Enter your city"
            className="w-full rounded border bg-transparent px-3 py-2 text-gray-300"
          />

          <input
            type="date"
            placeholder="Select date"
            className="w-full rounded border bg-transparent px-3 py-2 text-gray-300"
          />

          <span className="rounded border border-gray-700 px-3 py-2 text-sm text-gray-300">
            ▦ Category
            <br />
            <small>All Categories</small>
          </span>
          <button className="w-full rounded-lg bg-violet-600 px-8 py-3 font-semibold text-white transition hover:bg-violet-500 sm:col-span-2 lg:col-span-1">
            Search
          </button>
        </div>
        <div className="mx-auto my-6 flex max-w-7xl flex-col gap-6 px-4 sm:my-10 sm:px-6 lg:flex-row lg:px-8">

          <div className="w-full rounded-2xl bg-[#0D0E18] px-4 sm:px-5 lg:w-[30%]"> 
            <div className="flex items-center justify-between py-5">
            <div className="text-2xl text-white sm:text-3xl">Filters</div>
            <button className="text-blue-600 hover:text-blue-400 cursor-pointer "> Reset</button>
          </div>
          <hr className=" border-0.5 border-gray-600  " />
          <div className="text-white pt-4 "> Categories</div>
          
          <div className=" flex gap-2 items-center pt-4 text-white justify-between px-2">
          <input type="checkbox" name="All Categories" />    
          <h2>All Categories</h2>  
          <h2>236</h2> 
             </div>
             <div className="text-white my-2 gap-y-2">
             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> 🎵 Music</h1>
              <h1> 48 </h1>
             </div>

             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> 💻 Workshop</h1>
              <h1> 36 </h1>
             </div>

             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> 🏆 Sports</h1>
              <h1> 29 </h1>
             </div>

             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> 🎭 Culture</h1>
              <h1> 40 </h1>
             </div>

             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> 💼 Business</h1>
              <h1> 35 </h1>
             </div>

             <div className="flex gap-2 items-center justify-between py-2 px-3">
              <h1> … Others</h1>
              <h1> 48 </h1>
             </div>
             </div>
             <hr className=" border-0.5 border-gray-600  " />
             <div className="flex flex-col gap-2 py-4 px-2"> 
              <h1 className="text-white">Date</h1>
              <input type="date" placeholder="Select Date" className="h-10 w-full rounded border border-gray-600 bg-transparent text-gray-500" />
              <hr className=" border-0.5 border-gray-600  " />
               <h1 className="text-white">Location</h1>
              <input type="text" placeholder="Enter Location" className="h-10 w-full rounded border border-gray-600 bg-transparent text-gray-500" />
              <hr className=" border-0.5 pt-2 border-gray-600  " />

              <div className="flex flex-col gap-2 py-4 px-2 text-white"> 
                <h1>
                  Price Range
                </h1>
                <input type="range" min="0" max="5000" className="w-full text-blue-800" />
                <div className="flex justify-between px-2  "> <h1>₹0</h1> <h1>₹5000+</h1> </div>
              </div>
             </div>
             <button className="bg-blue-600 text-white py-4 w-full mb-10  px-4 rounded hover:bg-blue-700"> Apply Filters</button>
          </div>
          <div className="w-full text-white lg:w-[70%]">
            <div className="flex flex-col gap-4 px-1 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-5">
              <div>
                <h1><span className="text-blue-500">236</span> Events Found</h1>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
               <div className="flex min-w-0 items-center gap-2 text-sm sm:text-base"> <h1>sort by:</h1>
                <select name="sort" className="h-8 min-w-0 rounded border border-gray-600 bg-[#0D0E18] text-white">
                  <option value="Upcoming First">Upcoming First</option>
                  <option value="Price: low to high">Price: Low to High</option>
                  <option value="Price: high to low">Price: High to Low</option>
                  <option value="Most Popular">Most Popular</option>
                  <option value="Newest First">Newest First</option>
                </select>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <h1> View : </h1>
                  <div className="flex gap-1 rounded-lg border border-gray-700 p-1">
                    <button
                      type="button"
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                      onClick={() => setViewMode("grid")}
                      className={`rounded px-2 py-1 text-xl leading-none transition ${viewMode === "grid" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      ⊞
                    </button>
                    <button
                      type="button"
                      aria-label="List view"
                      aria-pressed={viewMode === "list"}
                      onClick={() => setViewMode("list")}
                      className={`rounded px-2 py-1 text-xl leading-none transition ${viewMode === "list" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col"} gap-4 px-0 sm:gap-5 lg:px-5`}>
                {visibleEvents.map((e)=>(
                  <div key={e.id} className={`${viewMode === "list" ? "flex flex-row" : ""} group overflow-hidden rounded-lg border border-transparent bg-gray-800 shadow-lg transition duration-300 ease-out hover:-translate-y-2 hover:border-violet-500/60 hover:shadow-xl hover:shadow-violet-950/40`}>
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-32 shrink-0 sm:w-56" : ""}`}>
                      <img src={e.image} alt={e.name} className={`${viewMode === "list" ? "h-full min-h-32" : "h-52 sm:h-48"} w-full object-cover transition duration-500 ease-out group-hover:scale-110`} />
                      <span className="absolute left-3 top-3 max-w-[calc(100%-4rem)] truncate rounded-full bg-violet-600 px-3 py-1 text-sm font-semibold text-white shadow-lg transition duration-300 group-hover:bg-violet-500">
                        {categoryIcons[e.category] || "📌"} {e.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(e.id)}
                        aria-label={`${favoriteEvents.includes(e.id) ? "Remove" : "Add"} ${e.name} ${favoriteEvents.includes(e.id) ? "from" : "to"} favorites`}
                        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-2xl leading-none transition duration-300 hover:scale-110 hover:bg-black/75 ${favoriteEvents.includes(e.id) ? "text-pink-500" : "text-white"}`}
                      >
                        {favoriteEvents.includes(e.id) ? "♥" : "♡"}
                      </button>
                    </div>
                    <div className={`${viewMode === "list" ? "min-w-0 flex-1 p-3 sm:p-4" : "p-4"}`}>
                      <h2 className="text-base font-bold text-white transition-colors group-hover:text-violet-300 sm:text-xl">{e.name}</h2>
                      <p className="text-gray-400">{e.location}</p>
                      <p className="text-gray-400">{e.date}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span> Tickets Left: {e.availableTickets}</span>
                        <p className="text-blue-500 font-bold">₹{e.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm text-white">
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
                    className={`h-9 min-w-9 rounded-lg px-3 transition ${currentPage === page ? "bg-violet-600" : "border border-gray-700 hover:border-violet-500"}`}
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

            </div>
            
          </div>
        </div>
    </div>
  );
};

export default Events;
