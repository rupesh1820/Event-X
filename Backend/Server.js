
import "dotenv/config";
import express from "express";
import cors from "cors";

import inquiryrouter from "./Routes/inquiry.js";
import { Rolerouter } from "./Routes/RoleRoutes.js";
import AdminRouter from "./Routes/AdminRoute.js";
import PaymentRouter from "./Routes/Paymentroute.js";
import { connectDB } from "./Config/db.js";
import authRouter from "./Routes/AuthRoutes.js";
import eventRouter from "./Routes/EventRouter.js";

import { requireAuth } from "./Middleware/auth.js";
import {
  bookingUp,
  cancelBooking,
  getBookings,
} from "./Controllers/AuthContro.js";

const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  "https://event-x-official.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://event-x-official-wb.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api", eventRouter);
app.use("/api", Rolerouter);

app.post("/api/book", requireAuth, bookingUp);
app.get("/api/book", getBookings);
app.patch("/api/book/:id", requireAuth, cancelBooking);

app.use("/api/payment", PaymentRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/inquiries", inquiryrouter);

app.get("/", (req, res) => {
  res.status(200).send("EventX Server is running");
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  if (err?.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: err?.message || "Internal server error",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on port ${port}`);
      console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
    });
  } catch (error) {
    console.error("Database startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

