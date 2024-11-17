import mongoose, { Schema, Document } from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface transactions extends Document {
    sentTo: string;
    Amount: number;
    time: Date;
    from: string;
    transactionId: string;
}

const transactionSchema: Schema<transactions> = new mongoose.Schema({
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
}, { timestamps: true });

const userTransaction = mongoose.model<transactions>("Transactions", transactionSchema);
export default userTransaction;
