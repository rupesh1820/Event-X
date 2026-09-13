import express from "express";
import {
	bookingUp,
	deleteProfile,
	getProfile,
	login,
	register,
	updateProfile,
} from "../Controllers/AuthContro.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/book", bookingUp);
authRouter.get("/profile/:id", getProfile);
authRouter.patch("/profile/:id", updateProfile);
authRouter.delete("/profile/:id", deleteProfile);



export default authRouter;