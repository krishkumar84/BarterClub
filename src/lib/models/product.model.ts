import { Document, Schema, model, models } from "mongoose";

// Define the interface for the Product document
export interface IProduct extends Document {
  clerkId: string;
  userId: string;
  title: string;
  description: string;
  condition: 'new' | 'old';
  type: 'product' | 'service';
  availableQty: number;
  deliveryTime: number;
  category: { _id: string ,name: string };
  owner: { _id: string,Name: string };
  price: number;
  gst?: number;
  rating?: number;
  delivery: 'free' | 'INR' | 'Barter points';
  images?: string[];
  video?: string;
}

// Define the schema for the Product model
const ProductSchema = new Schema<IProduct>({
  clerkId: { type: String, required: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  condition: {
    type: String,
    enum: ['new', 'old'],
    required: true
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true
  },
  availableQty: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, required: true },
  gst: { type: Number, default: 0 },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  delivery: {
    type: String,
    enum: ['free', 'INR', 'Barter points'],
    required: true
  },
  images: {
    type: [String],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 3;
      },
      message: '{PATH} exceeds the limit of 3 images'
    }
  },
  video: {
    type: String,
    validate: {
      validator: function(v: string | null) {
        return v == null || v.length > 0;
      },
      message: 'Video URL cannot be empty'
    }
  }
}, { timestamps: true });

// Check if the model already exists before defining it
const Product = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
