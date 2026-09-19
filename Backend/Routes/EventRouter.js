import express from "express";

import {
  getMyEvents,
  eventCreate,
  GetallEvent,
  GetEventById,
  getMyBookings,
  getCreatorBookings,
  cancelMyBooking,
} from "../Controllers/EventCon.js";

import upload from "../Middleware/upload.js";
import { requireAuth } from "../Middleware/auth.js";

const eventRouter = express.Router();

// Create Event
eventRouter.post(
  "/event-create",
  requireAuth,
  upload.single("image"),
  eventCreate
);

// Get all events
eventRouter.get("/events", GetallEvent);

// Get event by ID
eventRouter.get("/events/:id", GetEventById);

// User's events
eventRouter.get("/my-events", requireAuth, getMyEvents);

// User's bookings
eventRouter.get("/my-bookings", requireAuth, getMyBookings);

// Creator's bookings
eventRouter.get("/creator/bookings", requireAuth, getCreatorBookings);

// Cancel booking
eventRouter.patch(
  "/my-bookings/:id/cancel",
  requireAuth,
  cancelMyBooking
);

export default eventRouter;