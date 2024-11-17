import mongoose, { Document, mongo, Schema } from "mongoose";
import { Iwallet } from "./userWallet";
import { transactions } from "./userTransactions";
import { Irequest } from "./userRequestMoneyModel";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken: number;
    verificationTokenExpire: Date;
    wallet: mongoose.Schema.Types.ObjectId | Iwallet;
    transactions: mongoose.Schema.Types.ObjectId[];
    requestMoney: mongoose.Schema.Types.ObjectId[];
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: Number,
    },
    verificationTokenExpire: {
        type: Date,
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
    },
    transactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transactions",
            required: true,
        },
    ],
    requestMoney: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ReplyUser"
        }
    ]
}, { timestamps: true });

const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
