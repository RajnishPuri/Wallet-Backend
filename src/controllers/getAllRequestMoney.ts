import User from "../models/userModel";
import { Request, Response } from "express";

interface AuthenticatedUser extends Request {
    user?: { email: string }
}

export const getAllRequestMoney = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string };

    try {

        const user = await User.findOne({ email: email }).populate("requestMoney").exec();

        const allRequesttMoney = user?.requestMoney;

        console.log(allRequesttMoney);

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed",
            allRequesttMoney
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!",

        });
    }
}