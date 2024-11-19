import User from "../models/userModel";
import Wallet from "../models/userWallet";
import Transaction from "../models/userTransactions";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface AuthenticateRequest extends Request {
    user?: { email: string };
    amount: number,
    toUser: string
}

export const sendMoney = async (req: AuthenticateRequest, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string }; // Authenticated user's email
    const { amount, toUser }: { amount: number; toUser: string } = req.body; // Explicitly typed destructuring

    if (!amount || amount <= 0 || !email || !toUser) {
        return res.status(400).json({
            success: false,
            message: "Invalid request. Provide a valid amount, sender, and receiver.",
        });
    }

    console.log("email : ", email);
    console.log("toUser : ", toUser);

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Fetch sender and receiver with wallets
        const sender = await User.findOne({ email }).populate("wallet").session(session);
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

        if (!senderWallet || !receiverWallet) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Sender's or receiver's wallet not found.",
            });
        }

        // Check for sufficient balance
        if (senderWallet.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient funds in the sender's wallet.",
            });
        }

        console.log("Sender Details : ", senderWallet);
        console.log("Reciever Details : ", receiverWallet);

        // Perform transactions
        (senderWallet.balance as number) = senderWallet.balance - amount;
        (receiverWallet.balance as number) = receiverWallet.balance + amount;

        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        // Create debit transaction for sender
        const debitTransaction = new Transaction({
            sentTo: toUser,
            Amount: amount,
            from: email,
            transactionId: uuidv4(),
            transactionType: "debit",
        });

        // Create credit transaction for receiver
        const creditTransaction = new Transaction({
            sentTo: toUser,
            Amount: amount,
            from: email,
            transactionId: uuidv4(),
            transactionType: "credit",
        });

        await debitTransaction.save({ session });
        await creditTransaction.save({ session });

        // Link transactions to sender and receiver
        sender.transactions.push(debitTransaction._id as mongoose.Schema.Types.ObjectId);
        receiver.transactions.push(creditTransaction._id as mongoose.Schema.Types.ObjectId);

        await sender.save({ session });
        await receiver.save({ session });

        // Commit transaction
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Transaction successful.",
            transactionId: debitTransaction.transactionId,
            senderBalance: senderWallet.balance,
            receiverBalance: receiverWallet.balance,
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

