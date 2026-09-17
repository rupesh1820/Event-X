import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
const categoryIcons = {
  Music: '🎵',
  Workshop: '💻',
  Sports: '🏆',
  Cultural: '🎭',
  Business: '💼',
  Technology: '💡',
};

const EventsDetails = () => {
  const { id } = useParams();
   const API_URL = import.meta.env.VITE_SERVER ||"http://localhost:5001"
  const[loading, setLoading]=useState(true)
  const [eve, setEve] = useState(null)
  useEffect(()=>{
    const fetchDataBYId=async()=>{
      try {
         const res = await axios.get(`${API_URL}/api/events/${id}`);
         console.log(res.data)
        const data = res.data.event;
        if(!data){
          throw new Error("event data not found")
        }
        setEve({
          id: data._id,
          name: data.title,
          category: data.category,
          image: data.image || data.imageUrl,
          location: `${data.venueName || ""}, ${data.city || ""}`,
          date: data.date,
          time: data.time,
          availableTickets: data.maxCapacity || 0,
          price: data.ticketPrice || 0,
          description: data.shortDescription,
        })
      } catch (error) {
        console.error("events not found", error)
        setEve(null)
      }finally{
        setLoading(false)
      }
    }
    fetchDataBYId()
  },[id, API_URL])
   if(loading){
    return <div className='p-10, text-center, text-white'> Loading...</div>
   }
  if (!eve) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-white">
        <h1 className="text-3xl font-bold">Event not found</h1>
        <p className="mt-3 text-gray-400">The event you are looking for does not exist.</p>
        <Link
          to="/events"
          className="mt-6 inline-block rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const dateText = eve.date
  ? new Date(eve.date).toLocaleDateString()
  : "Date unavailable"

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white sm:px-6 lg:py-12 lg:px-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-300">
        <Link to="/events" className="hover:text-violet-400">Events</Link>
        <span>/</span>
        <span className="text-violet-400">{eve.name}</span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-violet-500/20 bg-[#0d0e18] shadow-[0_12px_40px_rgba(124,58,237,0.15)]">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-75">
            {eve.image ? (
              <img src={eve.image} alt={eve.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-75 items-center justify-center bg-white/5 text-gray-400">
                Event image unavailable
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-[#0d0e18] via-transparent to-transparent" />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <span>{categoryIcons[eve.category] || '📌'}</span>
              {eve.category}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-300">
                {eve.category}
              </span>
              <span className="text-sm text-gray-400">{eve.availableTickets} tickets left</span>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">{eve.name}</h1>

            <div className="mt-6 space-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <span className="text-lg">📍</span>
                <span>{eve.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🗓️</span>
                <span>{dateText}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">⏰</span>
                <span>{eve.time}</span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/2 p-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-400">Starting from</p>
                  <p className="text-3xl font-bold text-violet-400">₹{eve.price}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                  Instant confirmation
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                 to={`/payment/${eve.id}`}
                className="flex-1 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500"
              >
                Book Now
              </Link>
              <Link
                to="/events"
                className="flex-1 rounded-xl border border-gray-700 bg-transparent px-5 py-3 text-center font-semibold text-white transition hover:border-violet-500 hover:text-violet-300"
              >
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-white/10 bg-[#0d0e18] p-6">
          <h2 className="text-2xl font-bold text-white">About this event</h2>
          <p className="mt-4 text-base leading-7 text-gray-300">
            Join {eve.name} for a curated experience designed to bring people together around creativity,
            energy, and memorable moments. Whether you are attending solo or with friends, this event is
            built to offer a premium atmosphere with standout performances, networking, and unforgettable
            access.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ['Experience', 'Premium live access'],
              ['Audience', '500+ attendees'],
              ['Highlights', 'Live sessions + music'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-violet-300">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-white/10 bg-[#0d0e18] p-6">
          <h3 className="text-xl font-bold text-white">Booking details</h3>

          <div className="mt-5 space-y-4 text-sm text-gray-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Ticket price</span>
              <span className="font-semibold text-white">₹{eve.price}</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Booking fee</span>
              <span className="font-semibold text-white">Included</span>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span>Entry type</span>
              <span className="font-semibold text-white">General</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Availability</span>
              <span className="font-semibold text-emerald-400">{eve.availableTickets > 0 ? 'Open' : 'Sold out'}</span>
            </div>
          </div>

          <Link
             to={`/payment/${eve.id}`}
            className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white transition hover:bg-emerald-400"
          >
            Reserve Ticket
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default EventsDetails;
