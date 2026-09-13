import { Link, useLocation } from "react-router-dom";

const BookingSuccess = () => {
  const { state } = useLocation();
  

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center text-white">
      <div className="rounded-2xl border border-emerald-500/30 bg-[#0d0e18] p-8">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-3xl font-bold">Booking Confirmed</h1>

        <p className="mt-3 text-gray-400">
          Your ticket has been reserved successfully.
        </p>

        {state && (
          <div className="mt-6 rounded-xl bg-white/5 p-4 text-left text-sm">
            <p>Event: {state.eventName}</p>
            <p className="mt-2">Tickets: {state.quantity}</p>
            <p className="mt-2">Total: ₹{state.total}</p>
          </div>
        )}

        <Link
          to="/events"
          className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 font-semibold"
        >
          Explore More Events
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;