import { Request, Response } from "express";
import User from "../models/userModel";
import Wallet, { Iwallet } from "../models/userWallet";
import Transactions from "../models/userTransactions";
import ReplyUser from '../models/userRequestMoneyModel';
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";


interface AuthenticatedUser extends Request {
    user?: { email: string };
    senderAccountNumber?: number;
    amount?: number;
    id?: number;
}

export const sendrequestMoney = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    try {
        const { email } = req.user as { email: string };
        const { senderAccountNumber, amount }: AuthenticatedUser = req.body;

        const user = await User.findOne({ email: email }).populate("wallet");

        const fullName = `${user?.firstName} ${user?.lastName}`;
        const reciepientWallet = user?.wallet as unknown as Iwallet;
        const reciepentAccountNumber = reciepientWallet.AccountNumber;

        if (senderAccountNumber === reciepentAccountNumber) {
            return res.status(401).json({
                success: false,
                message: "User Cannot request money to their own Account Number!"
            });
        }

        const isValidSenderAccountNumber = await Wallet.findOne({ AccountNumber: senderAccountNumber }).exec();

        if (!isValidSenderAccountNumber) {
            return res.status(401).json({
                success: false,
                message: "Requesting Account Number is Incorrect!"
            });
        }

        console.log(isValidSenderAccountNumber);

        const senderUser = await User.findOne({ wallet: isValidSenderAccountNumber._id }).populate("requestMoney").exec();

        if (!senderUser) {
            return res.status(404).json({
                success: false,
                message: "Sender user not found!"
            });
        }

        const addUserRequest = new ReplyUser({
            reciepientName: fullName,
            reciepientEmail: email,
            senderAccountNumber: reciepentAccountNumber,
            Amount: amount,
            Completed: false
        });

        console.log("check - ", addUserRequest);

        console.log(senderUser);
        console.log("hello");


        await addUserRequest.save();
        console.log("hello2");



        senderUser.requestMoney.push(addUserRequest._id as mongoose.Schema.Types.ObjectId);
        await senderUser.save();

        console.log("Completed");

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!"
        });
    }
};

export const completeRequestMoney = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    const { email } = req.user as { email: string };

    const { id }: AuthenticatedUser = req.body;
    console.log(id);

    const requestUser = await ReplyUser.findById({ _id: id });

    if (!requestUser) {
        return res.status(401).json({
            success: false,
            message: "Not a Valid Request"
        })
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const sender = await User.findOne({ email: email }).populate("wallet").session(session);
        const receiver = await User.findOne({ email: requestUser.reciepientEmail }).populate("wallet").session(session);

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

        if (senderWallet.balance < requestUser.Amount) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Insufficient funds in the sender's wallet.",
            });
        }
        (senderWallet.balance as number) = senderWallet.balance - requestUser.Amount;
        (receiverWallet.balance as number) = receiverWallet.balance + requestUser.Amount;



        await senderWallet.save({ session });
        await receiverWallet.save({ session });

        const debitTransaction = new Transactions({
            sentTo: requestUser.reciepientEmail,
            Amount: requestUser.Amount,
            from: email,
            transactionId: uuidv4(),
            transactionType: "debit",
        });

        const creditTransaction = new Transactions({
            sentTo: requestUser.reciepientEmail,
            Amount: requestUser.Amount,
            from: email,
            transactionId: uuidv4(),
            transactionType: "credit",
        });

        await debitTransaction.save({ session });
        await creditTransaction.save({ session });

        sender.transactions.push(debitTransaction._id as mongoose.Schema.Types.ObjectId);
        receiver.transactions.push(creditTransaction._id as mongoose.Schema.Types.ObjectId);

        await sender.save({ session });
        await receiver.save({ session });

        requestUser.Completed = true;

        await requestUser.save({ session });

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed"
        })
    }
    catch (e) {
        console.error("Error during transaction:", e);

        await session.abortTransaction();
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!"
        })
    }
    finally {
        session.endSession();
    }
} 