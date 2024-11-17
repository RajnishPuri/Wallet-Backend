import { Request, Response } from "express";
import User from "../models/userModel";
import Wallet, { Iwallet } from "../models/userWallet";

interface AuthenticatedUser extends Request {
    user?: { email: string };
}

export const getAccountNumber = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    try {
        const { email } = req.user as { email: string };

        const user = await User.findOne({ email: email }).populate("wallet");

        const userWallet = user?.wallet as unknown as Iwallet;

        const accountNumber = userWallet.AccountNumber;


        return res.status(200).json({
            success: true,
            message: "Account Number Fetched!",
            accountNumber
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            messsage: "Internal Server Error!"
        })
    }
}