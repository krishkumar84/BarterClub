import { Schema, model, models } from "mongoose";

// Order schema
const OrderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",  // References the Product model
    required: true
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",  // References the User model for the buyer
    required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "User",  // References the User model for the seller
    required: true
  },
  pointsExchanged: {
    type: Number,  // Number of points exchanged between users
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected","pending_delivery", "delivered"],  // Status of the transaction
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now  // Auto-set the creation time of the order
  },
  updatedAt: {
    type: Date,
    default: Date.now  // Auto-set the update time of the order
  }
}, { timestamps: true });

// If Order model exists, use it. Otherwise, create it.
const Order = models?.Order || model("Order", OrderSchema);

export default Order;
