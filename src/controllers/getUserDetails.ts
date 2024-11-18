import User from "../models/userModel";
import { Request, Response } from "express";
import { Iwallet } from "../models/userWallet";

interface AuthenticatedUser extends Request {
    user?: { email: string }
}

export const getUserDetails = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string };

    try {

        const user = await User.findOne({ email: email }).populate("wallet").exec();

        const userWallet = user?.wallet as Iwallet;

        const fullName = `${user?.firstName} ${user?.lastName}`;


        const data = {
            Name: fullName,
            Email: email,
            AccountNumber: userWallet.AccountNumber,
            Balance: userWallet.balance
        }

        console.log(data);

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed",
            data
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!",

        });
    }
}