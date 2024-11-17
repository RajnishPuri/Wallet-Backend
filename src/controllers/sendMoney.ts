import User from "../models/userModel";
import Wallet from "../models/userWallet";
import Transaction from "../models/userTransactions";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import mongoose from "mongoose";

interface AuthenticateRequest extends Request {
    user?: { email: string };
}

export const sendMoney = async (req: AuthenticateRequest, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string }; // Email of the authenticated user
    const { amount, toUser } = req.body;

    if (!amount || amount <= 0 || !email || !toUser) {
        return res.status(400).json({
            success: false,
            message: "Invalid request. Provide a valid amount, sender, and receiver.",
        });
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const sender = await User.findOne({ email: email }).populate("wallet").session(session);
        const receiver = await User.findOne({ email: toUser }).populate("wallet").session(session);

        if (!sender || !receiver || !sender.wallet || !receiver.wallet) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Sender or receiver not found, or wallets are missing.",
            });
        }

        const senderWallet = await Wallet.findById(sender.wallet).session(session);
        const receiverWallet = await Wallet.findById(receiver.wallet).session(session);

        if (!senderWallet) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Sender's wallet not found.",
            });
        }

        if (!receiverWallet) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Receiver's wallet not found.",
            });
        }

        if (senderWallet.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient funds in the sender's wallet.",
            });
        }

        senderWallet.balance -= amount;
        receiverWallet.balance += amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        const transaction = new Transaction({
            sentTo: toUser,
            Amount: amount,
            from: email,
            transactionId: Date.now().toString(), // Unique ID
        });

        await transaction.save({ session });

        sender.transactions.push(transaction._id as mongoose.Schema.Types.ObjectId);
        receiver.transactions.push(transaction._id as mongoose.Schema.Types.ObjectId);

        await sender.save({ session });
        await receiver.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Transaction successful.",
            transaction,
        });
    } catch (error) {
        console.error("Error during transaction:", error);

        await session.abortTransaction();

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    } finally {
        session.endSession();
    }
};
