import { Schema, model, models } from "mongoose";

// Define the transaction schema
const TransactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },  // Amount in INR or barter points
  transactionType: { 
    type: String, 
    enum: ['Purchase', 'Bonus'],  // Bonus = barter points credited as discount or free
    required: true 
  },
  points: { type: Number, required: true },  // Barter points credited
  date: { type: Date, default: Date.now },
  razorpayPaymentId: { type: String, required: true },  // Razorpay payment ID for security purposes
}, { timestamps: true });

// Check if model already exists
const Transaction = models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;