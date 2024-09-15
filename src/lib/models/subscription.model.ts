import { Schema, model, models } from "mongoose";

// Define subscription types and their attributes
const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Relation to user
  planType: { 
    type: String, 
    enum: ['Basic', 'Standard', 'Premium'], 
    required: true 
  },
  duration: { 
    type: String, 
    enum: ['Monthly', 'Yearly'], 
    required: true 
  },
  barterPoints: { type: Number, required: true },  // Points credited based on the subscription
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },  // Subscription expiry
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
  razorpaySubscriptionId: { type: String, required: true, unique: true },
}, { timestamps: true });

// Check if model already exists
const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);

export default Subscription;
