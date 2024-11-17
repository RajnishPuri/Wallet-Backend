import mongoose, { Schema, Document } from "mongoose";

export interface Iwallet extends Document {
    balance: number;
    AccountNumber: number;
}

const walletSchema: Schema<Iwallet> = new mongoose.Schema(
    {
        balance: {
            type: Number,
            default: 0,
        },
        AccountNumber: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const userWallet = mongoose.model<Iwallet>("Wallet", walletSchema);
export default userWallet;
