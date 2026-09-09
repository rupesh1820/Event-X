import { Link } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';
import { events } from '../Data/Data';

const MyRegistrations = () => {
  const featured = events.slice(0, 3);

  return (
    <DashboardLayout title="My Registrations">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">My Registrations</h2>
            <p className="mt-1 text-sm text-gray-400">Your upcoming event bookings and passes.</p>
          </div>
          <Link to="/events" className="text-sm font-medium text-violet-400 hover:text-violet-300">
            Explore more events
          </Link>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {featured.map((event, index) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-[#10131d] p-4">
              <div className="overflow-hidden rounded-xl">
                <img src={event.image} alt={event.name} className="h-44 w-full object-cover" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-violet-300">{event.category}</p>
                  <h3 className="mt-2 text-xl font-bold text-white">{event.name}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${index === 0 ? 'bg-emerald-500/15 text-emerald-300' : index === 1 ? 'bg-amber-500/15 text-amber-300' : 'bg-violet-500/15 text-violet-300'}`}>
                  {index === 0 ? 'Confirmed' : index === 1 ? 'Pending' : 'VIP'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-300">
                <p>📍 {event.location}</p>
                <p>🗓️ {event.day} {event.month} {event.year}</p>
                <p>⏰ {event.time}</p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="text-xs text-gray-500">Ticket</p>
                  <p className="font-semibold text-white">#{event.id.toString().padStart(4, '0')}</p>
                </div>
                <button className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">
                  View Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyRegistrations;
