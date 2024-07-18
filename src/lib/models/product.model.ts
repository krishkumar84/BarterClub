import { Schema, model, models, Model } from "mongoose";

const productSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'old'],
    required: true,
  },
  type: {
    type: String,
    enum: ['product', 'service'],
    required: true,
  },
  availableQty: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  category: { 
    type: Schema.Types.ObjectId,
     ref: 'Category'
     },
  price: {
    type: Number,
    required: true,
  },
  gst: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  delivery: {
    type: String,
    enum: ['free', 'INR', 'Barter points'],
    required: true,
  },
  images: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3 images'],
  },
  video: {
    type: String,
    validate: {
      validator: function(v:any) {
        return v == null || v.length > 0;
      },
      message: 'Video URL cannot be empty'
    }
  },
}, { timestamps: true });

function arrayLimit(val:string[]) {
  return val.length <= 3;
}

// Check if the model already exists before defining it
const Product: Model<any> = models.Product || model('Product', productSchema);

export default Product;
