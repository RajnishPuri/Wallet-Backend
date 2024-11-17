import User from "../models/userModel";
import Wallet, { Iwallet } from "../models/userWallet";
import { Request, Response } from "express";

interface AuthenticatedUser extends Request {
    user?: { email: string };
}

export const checkBalance = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    try {
        const { email } = req.user as { email: string };

        const user = await User.findOne({ email }).populate("wallet");

        if (!user || !user.wallet) {
            return res.status(404).json({
                success: false,
                message: "User or wallet not found",
            });
        }

        const wallet = user.wallet as unknown as Iwallet;
        console.log(wallet);

        console.log(wallet.balance)

        return res.status(200).json({
            success: true,
            message: "Balance fetched successfully",
            currentBalance: wallet.balance,
        });
    } catch (error) {
        console.error("Error fetching balance:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server issue",
        });
    }
};
