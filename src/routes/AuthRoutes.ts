import express from "express";
import { Register, verificationEmail, login, loggedOut } from "../controllers/userAuth";
import { Response } from "express";


const userRouter = express.Router();

userRouter.post('/register', Register as any);
userRouter.post('/verify-user', verificationEmail as any);
userRouter.post('/login', login as any);
userRouter.post('/logout', loggedOut as any);




export default userRouter;