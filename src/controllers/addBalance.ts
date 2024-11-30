import User from "../models/userModel";
import Wallet from "../models/userWallet";
import Transactions from "../models/userTransactions";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface AuthenticatedRequest extends Request {
    user?: { email: string };
}

export const addMoney = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
    try {
        const { email } = req.user as { email: string };
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount. Please enter a positive number.",
            });
        }

        if (amount > 500) {
            return res.status(400).json({
                success: false,
                message: "You can only add 500 at a time!",
            });
        }

        const user = await User.findOne({ email }).populate("wallet").exec();
        if (!user || !user.wallet) {
            return res.status(404).json({
                success: false,
                message: "User or wallet not found.",
            });
        }

        const wallet = await Wallet.findById(user.wallet);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found.",
            });
        }

        // Count the user's credit transactions in the last N transactions
        const recentTransactions = await Transactions.countDocuments({
            sentTo: email,
            transactionType: "credit",
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // e.g., within the last 24 hours
        });

        if (recentTransactions >= 5) {
            return res.status(400).json({
                success: false,
                message: "Transaction limit exceeded. You can only add money up to 5 times in 24 hours.",
            });
        }

        // Update wallet balance
        wallet.balance += amount;
        await wallet.save();

        // Add a new transaction
        const transaction = new Transactions({
            sentTo: email,
            Amount: amount,
            from: "System",
            transactionId: uuidv4(),
            transactionType: "credit",
        });
        await transaction.save();

        user.transactions.push(transaction._id as mongoose.Schema.Types.ObjectId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Amount added successfully.",
            wallet: { balance: wallet.balance },
            transaction,
        });
    } catch (error) {
        console.error("Error in addMoney:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
