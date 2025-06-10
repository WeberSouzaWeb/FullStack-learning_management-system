import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    userId: { type: String, ref: 'User', required: true }, // User ID from Clerk
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }, // Status of the transaction
}, { timestamps: true });

export const Purchase = mongoose.model('Purchase', PurchaseSchema);