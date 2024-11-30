import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Transactions extends Document {
    sentTo: string;
    Amount: number;
    from: string;
    transactionId: string;
    transactionType: "credit" | "debit";
}

const transactionSchema: Schema<Transactions> = new mongoose.Schema(
    {
        sentTo: {
            type: String,
            required: true,
        },
        Amount: {
            type: Number,
            required: true,
        },
        from: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            required: true,
            default: uuidv4,
            unique: true,
        },
        transactionType: {
            type: String,
            enum: ["credit", "debit"], // Restrict values to "credit" or "debit"
            required: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Add an index for optimized querying
transactionSchema.index({ createdAt: 1 });

const UserTransaction = mongoose.model<Transactions>("Transactions", transactionSchema);
export default UserTransaction;
