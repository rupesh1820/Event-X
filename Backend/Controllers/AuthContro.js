import crypto from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import mongoose from "mongoose";
import User from "../Models/Users.js";
import Booking from "../Models/Bookings.js";
import EventCreate from "../Models/CreateEvents.js";

const JWT_SECRET = process.env.JWT_SECRET || "eventx-development-secret";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin1820";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin1820";

export const Register = async(req, res)=>{

  try {
    const { fullName, emailAddress, password, confirmPassword, role } = req.body
  if(password!==confirmPassword){
    return res.json({message:"Password not matched"})
  }
  if(!fullName || !emailAddress || !password || !confirmPassword ){
    return res.status(400).json({ message: "All fields are required" })
  }
  const existUser = await User.findOne({ emailAddress })
  if(existUser){
    return res.status(401).json({message:" this email already in use"})
  }
     if(!validator.isEmail(emailAddress)){
      return res.status(400).json({message:"email is not valid"})
     }
  const hashedpass =await bcrypt.hash(password, 10);

  const Users= await User.create({
   fullName,
   emailAddress,
   password:hashedpass,
  role: role === "creator" ? "creator" : "user",
  })
  return res.status(201).json({message: "User create succesfully"})
  } catch (error) {
    return res.status(401).json({error: "User create failed"})
  }
  
};

export const register = Register;

export const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;

    if (emailAddress === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { userId: "admin", emailAddress: ADMIN_USERNAME, role: "admin" },
        JWT_SECRET,
        { expiresIn: "1d" },
      );
      return res.status(200).json({
        message: "Admin login successful",
        token,
        user: {
          id: "admin",
          fullName: "EventX Administrator",
          emailAddress: ADMIN_USERNAME,
          role: "admin",
        },
      });
    }

    if (!emailAddress || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ emailAddress });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, emailAddress: user.emailAddress, role: user.role || "user" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        role: user.role || "user",
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  emailAddress: user.emailAddress,
  number: user.number,
  username: user.username,
  bio: user.bio,
  language: user.language,
  timezone: user.timezone,
  role: user.role || "user",
});

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to load profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "emailAddress",
      "bio",
      "username",
      "number",
      "language",
      "timezone",
    ];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]]),
    );

    if (updates.emailAddress && !validator.isEmail(updates.emailAddress)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Profile updated", user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile" });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete account" });
  }
};

export const bookingUp = async (req, res) => {
  try {
    const {
      userId: bodyUserId,
      number: bodyNumber,
      attendeePhone,
      emailAddress: bodyEmailAddress,
      attendeeEmail,
      fullName: bodyFullName,
      attendeeName,
      eventId,
      eventName,
      eventImage,
      eventLocation,
      eventDate,
      eventTime,
      quantity,
      total,
      paymentMethod,
    } = req.body;
    const number = bodyNumber || attendeePhone;
    const emailAddress = bodyEmailAddress || attendeeEmail;
    const fullName = bodyFullName || attendeeName;

    if (!number || !emailAddress || !fullName || !eventId || !quantity) {
      return res.status(400).json({ message: "Booking details are required" });
    }

    const userId = req.user?.userId || bodyUserId || null;

    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: { number, fullName, emailAddress },
      });
    }

    const booking = new Booking({
      userId,
      fullName,
      number,
      emailAddress,
      eventId,
      eventName,
      eventImage,
      eventLocation,
      eventDate,
      eventTime,
      quantity,
      total,
      paymentMethod,
      status: "confirmed",
    });

    await booking.save();
    res.status(201).json({ message: "Booking Successful", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Error in booking" });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });

    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const event = mongoose.isValidObjectId(booking.eventId)
          ? await EventCreate.findById(booking.eventId)
              .select("image imageUrl venueName city date time")
              .lean()
          : null;

        return {
          ...booking.toObject(),
          id: booking._id,
          eventImage: booking.eventImage || event?.image || event?.imageUrl,
          eventLocation:
            booking.eventLocation ||
            [event?.venueName, event?.city].filter(Boolean).join(", "),
          eventDate: booking.eventDate || event?.date,
          eventTime: booking.eventTime || event?.time,
        };
      }),
    );

    return res.status(200).json({ bookings: enrichedBookings });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({ message: "Unable to get bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { status: "cancelled" } },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking cancelled",
      booking: { ...booking.toObject(), id: booking._id },
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Unable to cancel booking" });
  }
};