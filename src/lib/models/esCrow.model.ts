import { Schema, model, models } from "mongoose";

const EscrowTransactionSchema = new Schema({
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    amountHeld: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending_payment", "payment_completed","payment_refunded"],
      default: "pending_payment"
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }, { timestamps: true });
  
  const EscrowTransaction = models?.EscrowTransaction || model("EscrowTransaction", EscrowTransactionSchema);
  export default EscrowTransaction;
  