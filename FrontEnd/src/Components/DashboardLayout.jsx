import { NavLink, useNavigate } from "react-router-dom";

const userLinks = [
  ["Dashboard", "/profile/dashboard", "⌘"],
  ["My Tickets", "/profile/tickets", "▣"],
  ["My Registrations", "/registrations", "□"],
  ["Wishlist", "/wishlist", "♡"],
  ["Saved Events", "/saved-events", "▱"],
  ["My Orders", "/orders", "▤"],
  ["Notifications", "/notifications", "♧"],
  ["Profile Settings", "/profile", "♙"],
  ["Payment Methods", "/payments", "▣"],
];

const organizerLinks = [
  ["Dashboard", "/profile/organizer", "⌘"],
  ["Events", "/events", "□"],
  ["Create Event", "/profile/create-event", "✧"],
  ["Orders", "/orders", "▤"],
  ["Attendees", "/attendees", "♧"],
  ["Analytics", "/profile/analytics", "⌁"],
  ["Payouts", "/payouts", "▣"],
  ["Promotions", "/promotions", "◇"],
  ["Notifications", "/notifications", "♧"],
  ["Settings", "/profile", "⚙"],
];

const DashboardLayout = ({ children, organizer = false, title = "EventX" }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("eventxUser") || "null");
  const name = user?.fullName || user?.name || "Rupesh Raz";
  const email = user?.emailAddress || "rupeshraz@email.com";
  const links = organizer ? organizerLinks : userLinks;

  const logout = () => {
    localStorage.removeItem("eventxUser");
    localStorage.removeItem("eventxToken");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#070910] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-white/10 bg-[#0b0e17] lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-white/10 px-5 text-2xl font-bold">
          Event<span className="text-violet-500">X</span>
        </div>
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 font-bold">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-gray-500">
                {organizer ? "Organizer" : email}
              </p>
            </div>
          </div>
          <NavLink
            to="/profile"
            className="mt-3 block text-xs text-violet-400 hover:text-violet-300"
          >
            View Profile ?
          </NavLink>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {links.map(([label, path, icon]) => (
            <NavLink
              key={label}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-violet-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
              }
            >
              <span className="w-5 text-center">{icon}</span>
              {label}
              {label === "Notifications" && (
                <span className="ml-auto rounded bg-violet-600 px-1.5 text-[10px]">
                  3
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <NavLink
            to="/contact"
            className="mb-2 flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white"
          >
            ? Help & Support
          </NavLink>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm text-gray-400 hover:text-white"
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-56">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#070910]/95 px-4 backdrop-blur sm:px-7">
          <div className="flex items-center gap-3">
            <NavLink to="/home" className="text-xl font-bold lg:hidden">
              Event<span className="text-violet-500">X</span>
            </NavLink>
            <h1 className="hidden text-lg font-semibold sm:block">{title}</h1>
          </div>
          <div className="hidden w-full max-w-xl items-center gap-3 rounded-lg border border-white/10 bg-white/[.03] px-3 py-2 text-sm text-gray-500 md:flex">
            ⌕ <span>Search events, attendees, tickets...</span>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <span>♧</span>
            <span>▱</span>
            <NavLink to="/profile" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-bold">
                {name.slice(0, 2).toUpperCase()}
              </span>
              <span className="hidden text-sm text-white sm:block">{name}</span>
            </NavLink>
          </div>
        </header>
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
