import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_SERVER 

  const user = JSON.parse(localStorage.getItem("eventxUser") || "null");

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [customer, setCustomer] = useState({
    name: user?.fullName || "",
    email: user?.emailAddress || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/events/${id}`);
        setEvent(res.data.event);
      } catch (error) {
        console.error("Payment event error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, API_URL]);

  const price = Number(event?.ticketPrice || 0);
  const maxTickets = Number(event?.maxCapacity || 0);
  const total = price * quantity;

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!customer.name || !customer.email || !customer.phone) {
      alert("Please fill all attendee details");
      return;
    }

    if (quantity < 1 || quantity > maxTickets) {
      alert("Please select a valid ticket quantity");
      return;
    }

    setPaying(true);

    const booking = {
      id: crypto.randomUUID(),
      eventId: event._id,
      eventName: event.title,
      eventImage: event.image || event.imageUrl || null,
      eventLocation: [event.venueName, event.city].filter(Boolean).join(", "),
      eventDate: event.date || null,
      eventTime: event.time || null,
      userId: user?._id || user?.id || null,
      attendeeName: customer.name,
      attendeeEmail: customer.email,
      attendeePhone: customer.phone,
      quantity,
      total,
      paymentMethod: method,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(`${API_URL}/api/book`, booking, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("eventxToken") || ""}`,
        },
      });
    } catch (error) {
      console.error("Booking error:", error);
      setPaying(false);
      alert(error.response?.data?.message || "Unable to save booking");
      return;
    }

    const bookings = JSON.parse(
      localStorage.getItem("eventxBookings") || "[]"
    );

    localStorage.setItem(
      "eventxBookings",
      JSON.stringify([...bookings, booking])
    );

    navigate("/booking-success", { state: booking });
  };

  if (loading) {
    return <div className="p-10 text-center text-white">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="p-10 text-center text-white">
        <h2 className="text-2xl font-bold">Event not found</h2>
        <Link to="/events" className="mt-4 inline-block text-violet-400">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-white">
      <div className="rounded-2xl border border-white/10 bg-[#0d0e18] p-6">
        <h1 className="text-3xl font-bold">Complete Payment</h1>
        <p className="mt-2 text-gray-400">{event.title}</p>

        <form onSubmit={handlePayment} className="mt-6">
          <h2 className="mb-3 font-semibold">Attendee Details</h2>

          <input
            required
            placeholder="Full name"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
          />

          <input
            required
            type="email"
            placeholder="Email address"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
            className="mb-3 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
          />

          <input
            required
            type="tel"
            placeholder="Phone number"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            className="mb-5 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
          />

          <div className="rounded-xl bg-white/5 p-4">
            <div className="flex justify-between">
              <span>Ticket price</span>
              <span>₹{price}</span>
            </div>

            <label className="mt-4 block text-sm text-gray-300">
              Number of tickets
              <input
                type="number"
                min="1"
                max={maxTickets}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white"
              />
            </label>

            <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xl font-bold">
              <span>Total</span>
              <span className="text-emerald-400">₹{total}</span>
            </div>
          </div>

          <h2 className="mb-3 mt-6 font-semibold">Payment Method</h2>

          <div className="space-y-3">
            {[
              ["upi", "UPI"],
              ["card", "Credit / Debit Card"],
              ["netbanking", "Net Banking"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 p-3"
              >
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={method === value}
                  onChange={(e) => setMethod(e.target.value)}
                />
                {label}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={paying || maxTickets < 1 || quantity > maxTickets}
            className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {paying ? "Processing..." : `Pay ₹${total}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;