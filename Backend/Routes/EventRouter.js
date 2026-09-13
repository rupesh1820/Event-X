import express from "express"
import { eventCreate, GetallEvent, GetEventById }  from "../Controllers/EventCon.js"
import upload from "../Middleware/upload.js"
import { allowRoles, requireAuth } from "../Middleware/auth.js"

const eventRouter = express.Router()

eventRouter.post("/event-create", requireAuth, allowRoles("creator", "admin"), upload.single("image"), eventCreate );
eventRouter.get("/events", GetallEvent)
eventRouter.get("/events/:id", GetEventById)
export default eventRouter;