import express from "express"
import { eventCreate }  from "../Controllers/EventCon.js"
import upload from "../Middleware/upload.js"

const eventRouter = express.Router()

eventRouter.post("/event-create",upload.single("image"), eventCreate );

export default eventRouter;