import mongoose, { Schema, Document } from "mongoose"

export interface Irequest extends Document {
    senderAccountNumber: Number,
    Amount: Number,
    Completed: Boolean,
    user: mongoose.Schema.Types.ObjectId
}

const replyModel: Schema<Irequest> = new mongoose.Schema({
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const replyUserModel = mongoose.model("ReplyUser", replyModel);
export default replyUserModel;