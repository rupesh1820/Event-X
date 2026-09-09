import { Link } from 'react-router-dom';
import DashboardLayout from '../Components/DashboardLayout';
import { events } from '../Data/Data';

const Wishlist = () => {
  const saved = events.slice(2, 6);

  return (
    <DashboardLayout title="Wishlist">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Wishlist</h2>
            <p className="mt-1 text-sm text-gray-400">Events you saved for later.</p>
          </div>
          <Link to="/events" className="text-sm font-medium text-violet-400 hover:text-violet-300">
            Browse events
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {saved.map((event) => (
            <div key={event.id} className="flex gap-4 rounded-2xl border border-white/10 bg-[#10131d] p-4">
              <img src={event.image} alt={event.name} className="h-28 w-28 rounded-xl object-cover" />
              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-violet-300">{event.category}</p>
                      <h3 className="mt-1 text-lg font-bold text-white">{event.name}</h3>
                    </div>
                    <span className="text-xl text-pink-400">♥</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">📍 {event.location}</p>
                  <p className="text-sm text-gray-400">🗓️ {event.day} {event.month} {event.year}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold text-violet-400">₹{event.price}</span>
                  <button className="rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-500">
                    Book now
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

export default Wishlist;
