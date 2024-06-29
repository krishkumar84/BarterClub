import { Schema, model, models } from "mongoose";
import { getStaticPaths } from "next/dist/build/templates/pages";

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
  Gst:{
    type: Number,
    unique: true,
  },
    Address:{
        type: String,
        required: true,
    },
});

const User = models?.User || model("User", UserSchema);

export default User;