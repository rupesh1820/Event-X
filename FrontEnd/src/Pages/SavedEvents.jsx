import { Link } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';
import { events } from '../Data/Data';

const SavedEvents = () => {
  const items = events.slice(4, 8);

  return (
    <DashboardLayout title="Saved Events">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Saved Events</h2>
            <p className="mt-1 text-sm text-gray-400">All your bookmarked experiences in one place.</p>
          </div>
          <Link to="/events" className="text-sm font-medium text-violet-400 hover:text-violet-300">
            View all events
          </Link>
        </div>

        <div className="space-y-4">
          {items.map((event) => (
            <div key={event.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#10131d] p-4 sm:flex-row sm:items-center">
              <img src={event.image} alt={event.name} className="h-28 w-full rounded-xl object-cover sm:w-36" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-violet-300">{event.category}</p>
                  <h3 className="mt-1 text-lg font-bold text-white">{event.name}</h3>
                  <p className="text-sm text-gray-400">{event.location} · {event.day} {event.month} {event.year}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-violet-400">₹{event.price}</span>
                  <button className="rounded-lg border border-violet-500/40 bg-violet-500/10 px-3 py-2 text-sm font-semibold text-violet-300 hover:bg-violet-500 hover:text-white">
                    Reserve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedEvents;
