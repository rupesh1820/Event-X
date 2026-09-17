import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const TicketBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/https://eventx-backend-pq2m.onrender.com";
    // const API_URL = import.meta.env.VITE_SERVER || "https://eventx-backend-pq2m.onrender.com/https://eventx-backend-pq2m.onrender.com";
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        const data = res.data.event;

        if (!data) throw new Error("Event not found");

        setEvent(data);
      } catch (error) {
        console.error("Event fetch error:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, API_URL]);

  const reserveTicket = (e) => {
    e.preventDefault();

    if (!event || quantity > event.maxCapacity) return;

    setBooking(true);

    const reservation = {
      id: crypto.randomUUID(),
      eventId: event._id,
      eventName: event.title,
      quantity,
      total: quantity * Number(event.ticketPrice || 0),
      bookedAt: new Date().toISOString(),
    };

    const previousBookings = JSON.parse(
      localStorage.getItem("eventxBookings") || "[]"
    );

    localStorage.setItem(
      "eventxBookings",
      JSON.stringify([...previousBookings, reservation])
    );

    setTimeout(() => {
      navigate("/booking-success", { state: reservation });
    }, 500);
  };

  if (loading) {
    return <div className="p-10 text-center text-white">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="p-10 text-center text-white">
        <h1 className="text-2xl font-bold">Event not found</h1>
        <Link to="/events" className="mt-4 inline-block text-violet-400">
          Back to Events
        </Link>
      </div>
    );
  }

  const price = Number(event.ticketPrice || 0);
  const total = price * quantity;
  const maxTickets = Number(event.maxCapacity || 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 text-white">
      <Link to={`/events/${event._id}`} className="text-sm text-violet-400">
        ← Back to event
      </Link>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d0e18] p-6">
        <h1 className="text-3xl font-bold">Book Your Ticket</h1>
        <p className="mt-2 text-gray-400">{event.title}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm text-gray-400">Ticket price</p>
            <p className="mt-1 text-2xl font-bold text-violet-400">
              ₹{price}
            </p>
          </div>

          <div className="rounded-xl bg-white/5 p-4">
            <p className="text-sm text-gray-400">Available tickets</p>
            <p className="mt-1 text-2xl font-bold">{maxTickets}</p>
          </div>
        </div>

        <form onSubmit={reserveTicket} className="mt-6">
          <label className="text-sm text-gray-300">
            Number of tickets
            <input
              type="number"
              min="1"
              max={maxTickets}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-violet-500"
              required
            />
          </label>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
            <span className="text-gray-400">Total amount</span>
            <span className="text-2xl font-bold text-emerald-400">
              ₹{total}
            </span>
          </div>

          <button
            type="submit"
            disabled={booking || maxTickets < 1}
            className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {booking ? "Reserving..." : "Reserve Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketBooking;