import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
import jsPDF from "jspdf";

const API_URL =
  import.meta.env.VITE_SERVER || "http://localhost:5001"

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const getToken = () => {
    return (
      localStorage.getItem("eventxToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("authToken")
    )?.replace(/^Bearer\s+/i, "");
  };

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login first");
      }

      const response = await fetch(
        `${API_URL}/api/my-bookings`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Bookings fetch nahi hui"
        );
      }

      setBookings((data.bookings || []).filter((booking) => getStatus(booking) !== "cancelled"));
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getEventName = (booking) =>
    booking?.eventName ||
    booking?.eventTitle ||
    booking?.title ||
    booking?.event?.title ||
    "Event";

  const getEventImage = (booking) =>
    booking?.eventImage ||
    booking?.imageUrl ||
    booking?.image ||
    booking?.event?.imageUrl ||
    booking?.event?.image ||
    "";

  const getEventDate = (booking) =>
    booking?.eventDate ||
    booking?.date ||
    booking?.event?.date ||
    "";

  const getEventTime = (booking) =>
    booking?.eventTime ||
    booking?.time ||
    booking?.event?.time ||
    "N/A";

  const getEventLocation = (booking) =>
    booking?.eventLocation ||
    booking?.location ||
    booking?.venueName ||
    booking?.address ||
    booking?.event?.venueName ||
    booking?.event?.location ||
    "N/A";

  const getQuantity = (booking) =>
    Number(
      booking?.quantity ||
        booking?.ticketQuantity ||
        booking?.numberOfTickets ||
        1
    );

  const getPaymentMethod = (booking) =>
    booking?.paymentMethod ||
    booking?.paymentType ||
    booking?.payment ||
    "N/A";

  const getTotalAmount = (booking) =>
    Number(
      booking?.totalAmount ??
        booking?.total ??
        booking?.amount ??
        0
    );

  const getUserName = (booking) =>
    booking?.fullName ||
    booking?.name ||
    booking?.userName ||
    booking?.user?.fullName ||
    "N/A";

  const getUserEmail = (booking) =>
    booking?.emailAddress ||
    booking?.email ||
    booking?.user?.emailAddress ||
    booking?.user?.email ||
    "N/A";

  const getUserMobile = (booking) =>
    booking?.number ||
    booking?.mobile ||
    booking?.phone ||
    "N/A";

  const getBookingId = (booking) =>
    booking?._id || booking?.bookingId || "N/A";

  const getStatus = (booking) =>
    String(booking?.status || "confirmed").toLowerCase();

  const getQrValue = (booking) => {
    return JSON.stringify(
      {
        bookingId: getBookingId(booking),
        eventId:
          booking?.eventId ||
          booking?.event?._id ||
          "N/A",
        eventName: getEventName(booking),
        name: getUserName(booking),
        email: getUserEmail(booking),
        mobile: getUserMobile(booking),
        date: formatDate(getEventDate(booking)),
        time: getEventTime(booking),
        location: getEventLocation(booking),
        quantity: getQuantity(booking),
        payment: getPaymentMethod(booking),
        totalAmount: getTotalAmount(booking),
        status: getStatus(booking),
      },
      null,
      2
    );
  };

  const cancelTicket = async (booking) => {
    const bookingId = getBookingId(booking);

    if (!bookingId || bookingId === "N/A") {
      alert("Booking ID nahi mili");
      return;
    }

    if (getStatus(booking) === "cancelled") {
      alert("Ticket already cancelled hai");
      return;
    }

    const confirmCancel = window.confirm(
      "Kya aap ye ticket cancel karna chahte ho?"
    );

    if (!confirmCancel) return;

    try {
      setCancelling(true);

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/my-bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Ticket cancel nahi hui"
        );
      }

      const updatedBooking = {
        ...booking,
        status: "cancelled",
      };

      // Cancelled ticket ko My Bookings list se remove kar do
      setBookings((prev) =>
        prev.filter((item) => getBookingId(item) !== bookingId)
      );

      // Ticket modal bhi close ho jayega
      setSelectedBooking(null);

      alert(
        data.message || "Ticket successfully cancelled"
      );
    } catch (err) {
      console.error("Cancel ticket error:", err);
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const generateQrDataUrl = async (booking) => {
    return await QRCode.toDataURL(getQrValue(booking), {
      errorCorrectionLevel: "H",
      type: "image/png",
      width: 700,
      margin: 4,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  };

  const addPdfRow = (pdf, label, value, y) => {
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(110, 110, 120);
    pdf.text(label, 20, y);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(30, 30, 40);

    const wrappedValue = pdf.splitTextToSize(
      String(value ?? "N/A"),
      95
    );

    pdf.text(wrappedValue, pageWidth - 20, y, {
      align: "right",
    });

    return y + Math.max(8, wrappedValue.length * 5);
  };

  const downloadTicketPDF = async () => {
    if (!selectedBooking || downloading) return;

    try {
      setDownloading(true);

      const booking = selectedBooking;
      const qrDataUrl = await generateQrDataUrl(booking);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFillColor(248, 248, 252);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      pdf.setFillColor(91, 33, 182);
      pdf.roundedRect(
        12,
        10,
        pageWidth - 24,
        25,
        4,
        4,
        "F"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(25);
      pdf.setTextColor(255, 255, 255);
      pdf.text("EventX", pageWidth / 2, 26, {
        align: "center",
      });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.text("Your Event Ticket", pageWidth / 2, 31, {
        align: "center",
      });

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(25, 25, 35);

      const eventName = getEventName(booking);
      const eventNameLines = pdf.splitTextToSize(
        eventName,
        pageWidth - 40
      );

      pdf.text(eventNameLines, pageWidth / 2, 49, {
        align: "center",
      });

      let y = 49 + eventNameLines.length * 8 + 8;

      pdf.setDrawColor(210, 210, 220);
      pdf.line(18, y, pageWidth - 18, y);

      y += 10;

      y = addPdfRow(
        pdf,
        "Booking ID",
        getBookingId(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Name",
        getUserName(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Email",
        getUserEmail(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Mobile",
        getUserMobile(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Date",
        formatDate(getEventDate(booking)),
        y
      );

      y = addPdfRow(
        pdf,
        "Time",
        getEventTime(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Location",
        getEventLocation(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Quantity",
        getQuantity(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Payment",
        getPaymentMethod(booking),
        y
      );

      y = addPdfRow(
        pdf,
        "Status",
        getStatus(booking),
        y
      );

      y += 3;

      pdf.setFillColor(237, 233, 254);
      pdf.roundedRect(
        16,
        y,
        pageWidth - 32,
        16,
        3,
        3,
        "F"
      );

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(91, 33, 182);
      pdf.text("Total Amount", 23, y + 10);

      pdf.setFontSize(15);
      pdf.text(
        `Rs. ${getTotalAmount(booking)}`,
        pageWidth - 23,
        y + 10,
        {
          align: "right",
        }
      );

      y += 27;

      pdf.setDrawColor(170, 170, 180);
      pdf.setLineDashPattern([2, 2], 0);
      pdf.line(18, y, pageWidth - 18, y);
      pdf.setLineDashPattern([], 0);

      y += 10;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.setTextColor(35, 35, 45);
      pdf.text("Scan QR Code", pageWidth / 2, y, {
        align: "center",
      });

      y += 5;

      const qrSize = 62;
      const qrX = (pageWidth - qrSize) / 2;

      pdf.addImage(
        qrDataUrl,
        "PNG",
        qrX,
        y,
        qrSize,
        qrSize,
        undefined,
        "FAST"
      );

      y += qrSize + 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(110, 110, 120);

      pdf.text(
        "Scan this QR code to view complete booking details",
        pageWidth / 2,
        y,
        {
          align: "center",
        }
      );

      y += 12;

      pdf.setFontSize(8);
      pdf.setTextColor(140, 140, 150);

      pdf.text(
        "Thank you for booking with EventX",
        pageWidth / 2,
        y,
        {
          align: "center",
        }
      );

      const safeName = eventName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      pdf.save(`${safeName}-ticket.pdf`);
    } catch (err) {
      console.error("PDF download error:", err);
      alert("PDF generate nahi ho paya");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b14] text-gray-300">
        Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080b14] px-4">
        <div className="rounded-xl bg-[#10131d] p-6 text-center">
          <p className="text-red-400">{error}</p>

          <button
            onClick={fetchMyBookings}
            className="mt-4 rounded-lg bg-violet-600 px-5 py-2 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>

        <p className="mt-2 text-gray-400">
          View and download your event tickets
        </p>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#10131d] p-10 text-center">
            <div className="text-5xl">🎟️</div>

            <h2 className="mt-4 text-xl font-semibold">
              No bookings found
            </h2>

            <p className="mt-2 text-gray-400">
              You have not booked any event yet.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const eventName = getEventName(booking);
              const eventImage = getEventImage(booking);
              const status = getStatus(booking);
              const isCancelled = status === "cancelled";

              return (
                <div
                  key={booking._id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#10131d] shadow-lg"
                >
                  {eventImage ? (
                    <img
                      src={eventImage}
                      alt={eventName}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-violet-500/10 text-5xl">
                      🎫
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-xl font-bold">
                        {eventName}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs capitalize ${
                          isCancelled
                            ? "bg-red-500/15 text-red-400"
                            : status === "refunded"
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-green-500/15 text-green-400"
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-400">
                      <p>
                        <span className="text-gray-300">
                          Date:
                        </span>{" "}
                        {formatDate(getEventDate(booking))}
                      </p>

                      <p>
                        <span className="text-gray-300">
                          Time:
                        </span>{" "}
                        {getEventTime(booking)}
                      </p>

                      <p>
                        <span className="text-gray-300">
                          Location:
                        </span>{" "}
                        {getEventLocation(booking)}
                      </p>

                      <p>
                        <span className="text-gray-300">
                          Tickets:
                        </span>{" "}
                        {getQuantity(booking)}
                      </p>

                      <p>
                        <span className="text-gray-300">
                          Total:
                        </span>{" "}
                        ₹{getTotalAmount(booking)}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() =>
                          setSelectedBooking(booking)
                        }
                        className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold hover:bg-violet-500"
                      >
                        My Ticket
                      </button>

                      {!isCancelled &&
                        status !== "refunded" && (
                          <button
                            onClick={() =>
                              cancelTicket(booking)
                            }
                            className="rounded-xl bg-red-600/20 px-4 py-3 font-semibold text-red-400 hover:bg-red-600/30"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 px-4 py-8"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-md"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rounded-2xl border border-white/10 bg-[#10131d] p-6 text-white shadow-2xl">

              <div className="mb-5 text-center">
                <h2 className="text-3xl font-extrabold text-violet-500">
                  EventX
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Your Event Ticket
                </p>
              </div>

              {getEventImage(selectedBooking) && (
                <img
                  src={getEventImage(selectedBooking)}
                  alt={getEventName(selectedBooking)}
                  className="mb-5 h-44 w-full rounded-xl object-cover"
                />
              )}

              <h3 className="mb-5 text-center text-2xl font-bold">
                {getEventName(selectedBooking)}
              </h3>

              <div className="space-y-3 text-sm">
                {[
                  [
                    "Booking ID",
                    getBookingId(selectedBooking),
                  ],
                  ["Name", getUserName(selectedBooking)],
                  ["Email", getUserEmail(selectedBooking)],
                  ["Mobile", getUserMobile(selectedBooking)],
                  [
                    "Date",
                    formatDate(
                      getEventDate(selectedBooking)
                    ),
                  ],
                  ["Time", getEventTime(selectedBooking)],
                  [
                    "Location",
                    getEventLocation(selectedBooking),
                  ],
                  [
                    "Quantity",
                    getQuantity(selectedBooking),
                  ],
                  [
                    "Payment",
                    getPaymentMethod(selectedBooking),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-white/10 pb-2"
                  >
                    <span className="text-gray-400">
                      {label}
                    </span>

                    <span className="break-all text-right font-semibold text-gray-200">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <span className="text-gray-400">
                    Total Amount
                  </span>

                  <span className="text-lg font-bold text-violet-500">
                    ₹{getTotalAmount(selectedBooking)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-400">
                    Status
                  </span>

                  <span
                    className={`font-bold capitalize ${
                      getStatus(selectedBooking) === "cancelled"
                        ? "text-red-400"
                        : getStatus(selectedBooking) === "refunded"
                        ? "text-blue-400"
                        : "text-green-400"
                    }`}
                  >
                    {getStatus(selectedBooking)}
                  </span>
                </div>
              </div>

              <div className="my-6 border-t-2 border-dashed border-white/20" />

              <div className="flex flex-col items-center">
                <div className="rounded-xl bg-white p-4">
                  <QRCodeSVG
                    value={getQrValue(selectedBooking)}
                    size={220}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>

                <p className="mt-3 text-center text-xs text-gray-400">
                  Scan this QR code to view booking details
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-gray-500">
                Thank you for booking with EventX
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {!["cancelled", "refunded"].includes(
                getStatus(selectedBooking)
              ) && (
                <button
                  onClick={() =>
                    cancelTicket(selectedBooking)
                  }
                  disabled={cancelling}
                  className="flex-1 rounded-xl bg-red-600/20 px-4 py-3 font-semibold text-red-400 hover:bg-red-600/30 disabled:opacity-50"
                >
                  {cancelling
                    ? "Cancelling..."
                    : "Cancel Ticket"}
                </button>
              )}

              <button
                onClick={downloadTicketPDF}
                disabled={downloading}
                className="flex-1 rounded-xl bg-violet-600 px-4 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
              >
                {downloading
                  ? "Generating PDF..."
                  : "Download PDF"}
              </button>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-gray-300 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;