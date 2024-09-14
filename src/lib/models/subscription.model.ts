import { Schema, model, models } from "mongoose";

// Define subscription types and their attributes
const SubscriptionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Relation to user
  planType: { 
    type: String, 
    enum: ['Free', 'Startup', 'Organization'], 
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
}, { timestamps: true });

// Check if model already exists
const Subscription = models.Subscription || model('Subscription', SubscriptionSchema);

export default Subscription;
