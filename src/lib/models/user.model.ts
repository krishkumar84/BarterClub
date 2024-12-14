import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  photo:{
    type: String,
    required: false,
    unique: true,
  },
  Gst:{
    type: String,
  },
    Address:{
        type: String,
        required: true,
    },balance: {
       type: Number,
        default: 0 
      },
    purchasedPoints: {
       type: Number,
        default: 0 
      },
    discountPoints: {
       type: Number,
        default: 0 
      },
    subscription: {
      plan: { type: String, enum: ['Free','Basic', 'Standard', 'Premium'], default: 'Free' },
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
    },
    transactionHistory: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  },{ timestamps: true });

const User = models?.User || model("User", UserSchema);

export default User;