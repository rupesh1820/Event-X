import { NavLink } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';
import { events } from '../Data/Data';

const CreatorDashboard = () => {
  return (
    <DashboardLayout organizer title="Creator Panel">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Creator Dashboard</h2>
            <p className="mt-1 text-sm text-gray-400">Manage your events, analytics, and audience engagement.</p>
          </div>
          <NavLink to="/profile/create-event" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">
            + Add New Event
          </NavLink>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Total Events', '12', '+3 New', 'bg-violet-600'],
            ['Tickets Sold', '1,420', '+18.2%', 'bg-cyan-600'],
            ['Followers', '8.6K', '+9.4%', 'bg-emerald-600'],
            ['Revenue', '₹3.4L', '+22.7%', 'bg-pink-600'],
          ].map(([label, value, growth, color]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#10131d] p-4">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>◇</div>
              <p className="text-sm text-gray-400">{label}</p>
              <p className="mt-1 text-3xl font-bold text-white">{value}</p>
              <p className="mt-1 text-xs text-emerald-400">{growth}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Your Events</h3>
              <NavLink to="/events" className="text-sm text-violet-400">View all</NavLink>
            </div>

            <div className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/2 p-3">
                  <img src={event.image} alt={event.name} className="h-16 w-20 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{event.name}</p>
                    <p className="text-xs text-gray-400">{event.location}</p>
                    <p className="text-xs text-gray-500">{event.day} {event.month} {event.year}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-semibold text-emerald-300">Live</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#10131d] p-5">
            <h3 className="text-lg font-semibold text-white">Analytics Snapshot</h3>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm text-gray-400">Attendance Rate</p>
                <p className="mt-1 text-3xl font-bold text-white">82%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Ticket Conversion</p>
                <p className="mt-1 text-3xl font-bold text-white">64%</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg. Engagement</p>
                <p className="mt-1 text-3xl font-bold text-white">4.8/5</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
