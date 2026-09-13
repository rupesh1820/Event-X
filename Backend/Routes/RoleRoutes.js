import express from "express";
import {
  adminApproveEvent,
  adminDeleteEvent,
  adminDeleteUser,
  adminOverview,
  adminUpdateUserRole,
  createInquiry,
  creatorBookings,
  creatorOverview,
  updateBookingStatus,
  updateInquiryStatus,
} from "../Controllers/RoleController.js";
import { allowRoles, requireAuth } from "../Middleware/auth.js";

const roleRouter = express.Router();
roleRouter.post("/inquiries", createInquiry);
roleRouter.get("/creator/overview", requireAuth, allowRoles("creator"), creatorOverview);
roleRouter.get("/creator/bookings", requireAuth, allowRoles("creator"), creatorBookings);
roleRouter.patch("/creator/bookings/:id/status", requireAuth, allowRoles("creator"), updateBookingStatus);
roleRouter.get("/admin/overview", requireAuth, allowRoles("admin"), adminOverview);
roleRouter.patch("/admin/events/:id/status", requireAuth, allowRoles("admin"), adminApproveEvent);
roleRouter.delete("/admin/events/:id", requireAuth, allowRoles("admin"), adminDeleteEvent);
roleRouter.patch("/admin/users/:id/role", requireAuth, allowRoles("admin"), adminUpdateUserRole);
roleRouter.delete("/admin/users/:id", requireAuth, allowRoles("admin"), adminDeleteUser);
roleRouter.patch("/admin/bookings/:id/status", requireAuth, allowRoles("admin"), updateBookingStatus);
roleRouter.patch("/admin/inquiries/:id/status", requireAuth, allowRoles("admin"), updateInquiryStatus);

export default roleRouter;