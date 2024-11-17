import mongoose, { Schema, Document } from "mongoose"

export interface Irequest extends Document {
    reciepientEmail: string,
    reciepientName: string,
    senderAccountNumber: number,
    Amount: number,
    Completed: boolean,
    // user: mongoose.Schema.Types.ObjectId
}

const replyModel: Schema<Irequest> = new mongoose.Schema({
    reciepientName: {
        type: String,
        required: true
    },
    reciepientEmail: {
        type: String,
        required: true
    },
    senderAccountNumber: {
        type: Number,
        required: true
    },
    Amount: {
        type: Number,
        required: true
    },
    Completed: {
        type: Boolean,
        required: false,
        default: false
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true
    // }
})

const replyUserModel = mongoose.model("ReplyUser", replyModel);
export default replyUserModel;