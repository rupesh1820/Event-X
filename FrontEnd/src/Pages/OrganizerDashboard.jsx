import { NavLink } from "react-router-dom";
import DashboardLayout from "../Components/DashboardLayout";
import { events } from "../Data/Data";

const OrganizerDashboard = () => (
  <DashboardLayout organizer title="Organizer Dashboard">
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            Organizer Dashboard 👋
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Here&apos;s what&apos;s happening with your events.
          </p>
        </div>
        <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300">
          20 May - 26 May 2026⌄
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Revenue", "₹2,45,680", "+18.6%", "bg-violet-600"],
          ["Tickets Sold", "1,246", "+22.4%", "bg-blue-600"],
          ["Total Attendees", "1,062", "+20.1%", "bg-green-600"],
          ["Event Views", "8,754", "+15.3%", "bg-pink-600"],
        ].map(([label, value, growth, color]) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-[#10131d] p-4"
          >
            <div
              className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
            >
              ◇
            </div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            <p className="mt-1 text-xs text-green-400">
              {growth} vs last 7 days
            </p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Your Events</h3>
            <NavLink to="/events" className="text-sm text-violet-400">
              View All Events ?
            </NavLink>
          </div>
          {events.slice(0, 4).map((event, index) => (
            <div
              key={event.id}
              className="flex gap-3 border-b border-white/10 py-3 last:border-0"
            >
              <img
                src={event.image}
                alt=""
                className="h-16 w-24 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{event.name}</p>
                  <span className="rounded bg-green-900/50 px-2 py-1 text-[10px] text-green-300">
                    {index === 3 ? "Draft" : "Published"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  ◷ {event.day} {event.month} 2026 · {event.location}
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-500"
                    style={{ width: `${50 + index * 8}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
          <NavLink
            to="/create-event"
            className="mt-4 block rounded-lg border border-dashed border-violet-500/40 py-3 text-center text-sm text-violet-300"
          >
            + Create New Event
          </NavLink>
        </section>
        <section className="rounded-xl border border-white/10 bg-[#10131d] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Revenue Overview</h3>
            <span className="text-xs text-gray-500">Last 7 Days⌄</span>
          </div>
          <p className="mt-6 text-3xl font-bold">₹2,45,680</p>
          <p className="text-xs text-green-400">+18.6% vs last week</p>
          <div className="mt-8 flex h-36 items-end gap-3 border-b border-white/10 px-2">
            {[35, 55, 42, 70, 48, 58, 88].map((height, index) => (
              <div
                key={index}
                className="flex-1 rounded-t bg-violet-600/80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-[10px] text-gray-500">
            <span>20 May</span>
            <span>26 May</span>
          </div>
        </section>
      </div>
      <section className="rounded-xl border border-violet-500/30 bg-linear-to-r from-violet-950 to-[#141022] p-5">
        <h3 className="text-lg font-semibold">Need Help?</h3>
        <p className="mt-1 text-sm text-gray-400">
          We&apos;re here to help you manage and grow your events.
        </p>
        <button className="mt-4 rounded-lg border border-violet-400/50 px-4 py-2 text-sm text-violet-300">
          Contact Support
        </button>
      </section>
    </div>
  </DashboardLayout>
);

export default OrganizerDashboard;
