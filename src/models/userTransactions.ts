import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Transactions extends Document {
    sentTo: string;
    Amount: number;
    time: Date;
    from: string;
    transactionId: string;
    transactionType: "credit" | "debit";
}

const transactionSchema: Schema<Transactions> = new mongoose.Schema({
    sentTo: {
        type: String,
        required: true,
    },
    Amount: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
    from: {
        type: String,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
        default: uuidv4,
    },
    transactionType: {
        type: String,
        enum: ["credit", "debit"], // Allow only specific values
        required: true,
    },
}, { timestamps: true });

const UserTransaction = mongoose.model<Transactions>("Transactions", transactionSchema);
export default UserTransaction;
