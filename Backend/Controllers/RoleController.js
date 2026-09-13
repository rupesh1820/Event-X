import mongoose from "mongoose";
import User from "../Models/Users.js";
import EventCreate from "../Models/CreateEvents.js";
import Booking from "../Models/Bookings.js";
import Inquiry from "../Models/Inquiries.js";

export const createInquiry = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All inquiry fields are required" });
    }
    const inquiry = await Inquiry.create({ name, email, subject, message });
    return res.status(201).json({ message: "Inquiry submitted", inquiry });
  } catch (error) {
    console.error("Inquiry error:", error);
    return res.status(500).json({ message: "Unable to submit inquiry" });
  }
};

export const creatorOverview = async (req, res) => {
  const creatorId = req.user.userId;
  const events = await EventCreate.find({ creatorId }).sort({ createdAt: -1 }).lean();
  const eventIds = events.map((event) => String(event._id));
  const bookings = await Booking.find({ eventId: { $in: eventIds } }).lean();
  const confirmed = bookings.filter((booking) => booking.status === "confirmed");
  return res.json({
    events,
    bookings,
    stats: {
      events: events.length,
      ticketsSold: confirmed.reduce((sum, booking) => sum + booking.quantity, 0),
      attendees: confirmed.length,
      revenue: confirmed.reduce((sum, booking) => sum + booking.total, 0),
    },
  });
};

export const creatorBookings = async (req, res) => {
  const events = await EventCreate.find({ creatorId: req.user.userId }).select("_id").lean();
  const eventIds = events.map((event) => String(event._id));
  return res.json({ bookings: await Booking.find({ eventId: { $in: eventIds } }).sort({ createdAt: -1 }) });
};

export const updateBookingStatus = async (req, res) => {
  if (req.user.role === "creator") {
    const booking = await Booking.findById(req.params.id).lean();
    const ownsEvent = booking && await EventCreate.exists({
      _id: booking.eventId,
      creatorId: req.user.userId,
    });
    if (!ownsEvent) return res.status(403).json({ message: "Booking is not owned by this creator" });
  }
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  return res.json({ booking });
};

export const adminOverview = async (req, res) => {
  const [users, events, bookings, inquiries] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).lean(),
    EventCreate.find().sort({ createdAt: -1 }).lean(),
    Booking.find().sort({ createdAt: -1 }).lean(),
    Inquiry.find().sort({ createdAt: -1 }).lean(),
  ]);
  return res.json({
    users,
    events,
    bookings,
    inquiries,
    stats: {
      users: users.length,
      creators: users.filter((user) => user.role === "creator").length,
      events: events.filter((event) => event.approvalStatus === "approved" || !event.approvalStatus).length,
      revenue: bookings.filter((booking) => booking.status === "confirmed").reduce((sum, booking) => sum + booking.total, 0),
    },
  });
};

export const adminApproveEvent = async (req, res) => {
  const event = await EventCreate.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: req.body.status || "approved", approvedBy: req.user.userId },
    { new: true },
  );
  if (!event) return res.status(404).json({ message: "Event not found" });
  return res.json({ event });
};

export const adminDeleteEvent = async (req, res) => {
  const event = await EventCreate.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await Booking.deleteMany({ eventId: String(event._id) });
  return res.json({ message: "Event deleted" });
};

export const adminUpdateUserRole = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new: true, runValidators: true },
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
};

export const adminDeleteUser = async (req, res) => {
  if (String(req.params.id) === "admin") {
    return res.status(400).json({ message: "Admin account cannot be deleted" });
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await Booking.deleteMany({ userId: String(user._id) });
  return res.json({ message: "User deleted" });
};

export const updateInquiryStatus = async (req, res) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status || "resolved" },
    { new: true, runValidators: true },
  );
  if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });
  return res.json({ inquiry });
};