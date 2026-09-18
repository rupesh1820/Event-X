import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = (
    import.meta.env.VITE_SERVER || "http://localhost:5001"
  ).replace(/\/$/, "");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("eventxUser") || "null");
  } catch {
    user = null;
  }

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  const [customer, setCustomer] = useState({
    name: user?.fullName || "",
    email: user?.emailAddress || "",
    phone: user?.number || user?.phone || "",
  });

  // ==========================================
  // FETCH EVENT
  // ==========================================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/events/${id}`
        );

        setEvent(response.data?.event || null);
      } catch (err) {
        console.error("Payment event error:", err);
        setError(
          err.response?.data?.message ||
            "Event load nahi ho paya."
        );
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    } else {
      setLoading(false);
    }
  }, [id, API_URL]);

  const price = Number(event?.ticketPrice || 0);

  const maxTickets = Number(
    event?.maxCapacity || 0
  );

  const total = price * quantity;

  // ==========================================
  // TOKEN
  // ==========================================
  const getToken = () => {
    const token =
      localStorage.getItem("eventxToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken");

    if (!token) return null;

    return token
      .replace(/^Bearer\s+/i, "")
      .trim();
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logoutUser = () => {
    localStorage.removeItem("eventxToken");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("eventxUser");
  };

  // ==========================================
  // PHONE
  // ==========================================
  const getCleanPhone = (phone) => {
    let cleanPhone = String(phone || "").replace(
      /\D/g,
      ""
    );

    if (
      cleanPhone.length === 12 &&
      cleanPhone.startsWith("91")
    ) {
      cleanPhone = cleanPhone.slice(2);
    }

    return cleanPhone;
  };

  // ==========================================
  // PAYMENT
  // ==========================================
  const handlePayment = async (e) => {
    e.preventDefault();

    setError("");

    if (!event) {
      setError("Event information not available.");
      return;
    }

    const name = customer.name.trim();
    const email = customer.email.trim();
    const phone = getCleanPhone(customer.phone);

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10 digit phone number.");
      return;
    }

    if (
      quantity < 1 ||
      (maxTickets > 0 && quantity > maxTickets)
    ) {
      setError("Please select a valid ticket quantity.");
      return;
    }

    if (!price || price <= 0) {
      setError("Invalid ticket price.");
      return;
    }

    const token = getToken();

    if (!token) {
      logoutUser();
      navigate("/login");
      return;
    }

    const razorpayKey =
      import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      setError("Razorpay configuration missing.");
      return;
    }

    try {
      setPaying(true);

      // ========================================
      // CREATE ORDER
      // ========================================
      const orderResponse = await axios.post(
        `${API_URL}/api/payment/create-order`,
        {
          amount: Number(total),
        }
      );

      const order =
        orderResponse.data?.order;

      if (!order?.id) {
        throw new Error(
          "Razorpay order create nahi hua."
        );
      }

      // ========================================
      // RAZORPAY SCRIPT
      // ========================================
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout load nahi hua."
        );
      }

      // ========================================
      // RAZORPAY OPTIONS
      // ========================================
      const options = {
        key: razorpayKey,

        amount: Number(order.amount),

        currency: "INR",

        order_id: order.id,

        name: "EventX",

        description: "EventX Ticket",

        prefill: {
          name,
          email,
          contact: phone,
        },

        theme: {
          color: "#7c3aed",
        },

        // ======================================
        // SUCCESS
        // ======================================
        handler: async (paymentResponse) => {
          try {
            const verifyResponse =
              await axios.post(
                `${API_URL}/api/payment/verify`,
                {
                  razorpay_order_id:
                    paymentResponse.razorpay_order_id,

                  razorpay_payment_id:
                    paymentResponse.razorpay_payment_id,

                  razorpay_signature:
                    paymentResponse.razorpay_signature,

                  eventId:
                    event._id || event.id,

                  eventName:
                    event.title || "EventX Event",

                  eventImage:
                    event.image ||
                    event.eventImage ||
                    event.bannerImage ||
                    event.poster ||
                    null,

                  eventLocation:
                    event.location ||
                    event.venue ||
                    event.address ||
                    null,

                  eventDate:
                    event.date || null,

                  eventTime:
                    event.time || null,

                  fullName: name,

                  number: phone,

                  emailAddress: email,

                  quantity: Number(quantity),

                  total: Number(total),

                  paymentMethod: "razorpay",
                },
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,

                    "Content-Type":
                      "application/json",
                  },
                }
              );

            console.log(
              "Booking created:",
              verifyResponse.data
            );

            setPaying(false);

            navigate("/profile/my-tickets");
          } catch (err) {
            console.error(
              "Payment verification error:",
              err
            );

            console.error(
              "Backend response:",
              err.response?.data
            );

            setPaying(false);

            if (
              err.response?.status === 401
            ) {
              logoutUser();
              navigate("/login");
              return;
            }

            setError(
              err.response?.data?.message ||
                "Payment ho gaya, lekin booking create nahi hui."
            );
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      // ========================================
      // OPEN RAZORPAY
      // ========================================
      const razorpay =
        new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          console.error(
            "Razorpay error:",
            response?.error
          );

          setPaying(false);

          setError(
            response?.error?.description ||
              response?.error?.reason ||
              "Payment failed."
          );
        }
      );

      razorpay.open();
    } catch (err) {
      console.error(
        "Payment start error:",
        err
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      setPaying(false);

      if (err.response?.status === 401) {
        logoutUser();
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Payment start nahi ho paya."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080812] text-white">
        <div className="text-xl">
          Loading...
        </div>
      </div>
    );
  }

  // ==========================================
  // EVENT NOT FOUND
  // ==========================================
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080812] px-4 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">
            Event not found
          </h2>

          <Link
            to="/events"
            className="mt-4 inline-block text-violet-400"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-[#080812] px-4 py-10 text-white">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-white/10 bg-[#0d0e18] p-6 shadow-xl">

          <h1 className="text-3xl font-bold">
            Complete Payment
          </h1>

          <p className="mt-2 text-gray-400">
            {event.title}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handlePayment}
            className="mt-6"
          >
            <h2 className="mb-4 font-semibold">
              Attendee Details
            </h2>

            {/* NAME */}
            <input
              required
              type="text"
              placeholder="Full name"
              value={customer.name}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  name: e.target.value,
                })
              }
              className="mb-3 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />

            {/* EMAIL */}
            <input
              required
              type="email"
              placeholder="Email address"
              value={customer.email}
              onChange={(e) =>
                setCustomer({
                  ...customer,
                  email: e.target.value,
                })
              }
              className="mb-3 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />

            {/* PHONE */}
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Phone number"
              value={customer.phone}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setCustomer({
                  ...customer,
                  phone: value,
                });
              }}
              className="mb-5 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-gray-500 focus:border-violet-500"
            />

            {/* TICKET */}
            <div className="rounded-xl bg-white/5 p-4">

              <div className="flex justify-between">
                <span className="text-gray-300">
                  Ticket price
                </span>

                <span className="font-semibold">
                  ₹{price}
                </span>
              </div>

              <label className="mt-4 block text-sm text-gray-300">
                Number of tickets

                <input
                  type="number"
                  min="1"
                  max={
                    maxTickets > 0
                      ? maxTickets
                      : undefined
                  }
                  value={quantity}
                  onChange={(e) => {
                    let value =
                      Number(e.target.value);

                    if (!value || value < 1) {
                      value = 1;
                    }

                    if (
                      maxTickets > 0 &&
                      value > maxTickets
                    ) {
                      value = maxTickets;
                    }

                    setQuantity(value);
                  }}
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
                />
              </label>

              <div className="mt-4 flex justify-between border-t border-white/10 pt-4 text-xl font-bold">
                <span>Total</span>

                <span className="text-emerald-400">
                  ₹{total}
                </span>
              </div>
            </div>

            {/* PAY BUTTON ONLY */}
            <button
              type="submit"
              disabled={
                paying ||
                price <= 0 ||
                quantity < 1 ||
                (maxTickets > 0 &&
                  quantity > maxTickets)
              }
              className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying
                ? "Processing..."
                : `Pay ₹${total}`}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Razorpay checkout will open for payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;