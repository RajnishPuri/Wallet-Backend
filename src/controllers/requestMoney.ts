import { Request, Response } from "express";
import User from "../models/userModel";
import Wallet, { Iwallet } from "../models/userWallet";
import Transactions from "../models/userTransactions";
import ReplyUser from '../models/userRequestMoneyModel';

interface AuthenticatedUser extends Request {
    user?: { email: string };
    senderAccountNumber?: Number;
    Amount?: Number;
}



export const sendrequestMoney = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    try {
        const { email } = req.user as { email: string };

        const { senderAccountNumber, Amount }: AuthenticatedUser = req.body;

        console.log(senderAccountNumber, Amount, email);

        const user = await User.findOne({ email: email }).populate("wallet");

        const isValidSenderAccountNumber = await Wallet.findOne({ AccountNumber: senderAccountNumber });

        const ownAccountNumber = await user?.wallet as unknown as Iwallet;
        const OwnAccountNumber = ownAccountNumber.AccountNumber;

        const id = user?._id;
        console.log(id);

        if (!isValidSenderAccountNumber) {
            return res.status(401).json({
                success: false,
                message: "Requesting Account Number is Incorrect!"
            })
        }

        console.log(isValidSenderAccountNumber)

        if (isValidSenderAccountNumber.AccountNumber === OwnAccountNumber) {
            return res.status(300).json({
                success: false,
                message: "Can Not Request Money to Your Own Account Number!"
            })
        }

        const reciepentUser = await User.findById({ wallet: isValidSenderAccountNumber._id });

        console.log("Hello2")

        const requestMoney = new ReplyUser({
            senderAccountNumber: senderAccountNumber,
            Amount: Amount,
            Completed: false,
            user: reciepentUser?._id
        });

        console.log("Hello")
        await requestMoney.save();
        console.log("Hello3")

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed"
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!"
        })
    }
}

export const completeRequestMoney = async (req: AuthenticatedUser, res: Response): Promise<Response> => {
    try {

        return res.status(200).json({
            success: true,
            message: "Request Successfully Completed"
        })
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Issue!"
        })
    }
} 