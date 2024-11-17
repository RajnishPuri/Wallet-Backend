import User from "../models/userModel";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
    user?: { email: string }
}

export const getAllTransactions = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string };

    try {

        const user = await User.findOne({ email: email }).populate("transactions").exec();

        const alltansactions = user?.transactions;



        console.log(alltansactions);

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed",
            alltansactions
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!",

        });
    }
}