import * as z from "zod";

export const productSchema = z.object({
  // clerkId: z.string().refine((value) => value.trim() !== '', { message: "Clerk ID is required" }),
  // userId: z.string().refine((value) => value.trim() !== '', { message: "User ID is required" }),
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).refine((value) => value.trim() !== '', { message: "Title is required" }),
  description: z.string().min(3, { message: 'Description must be at least 3 characters' }).max(400, { message: 'Description must be less than 400 characters' }).refine((value) => value.trim() !== '', { message: "Description is required" }),
  condition: z.enum(['new', 'old'], { message: 'Condition must be either new or old' }),
  type: z.enum(['product', 'service'], { message: 'Type must be either product or service' }),
  availableQty: z.coerce.number().min(1, { message: 'Available quantity must be at least 1' }),
  deliveryTime: z.coerce.number().min(1, { message: 'Delivery time must be at least 1' }),
  categoryId: z.string().min(1, { message: 'Category must be selected' }),
  price: z.coerce.number().nonnegative({ message: "Price must be a positive number" }),
  gst: z.coerce.number().nonnegative({ message: "GST must be a non-negative number" }).optional(),
  rating: z.coerce.number().min(1, { message: 'Rating must be at least 1' }).max(5, { message: 'Rating must be at most 5' }).optional(),
  delivery: z.enum(['free', 'INR', 'Barter points'], { message: 'Delivery must be one of: free, INR, Barter points' }),
  images: z.array(z.string().url()).max(3, { message: 'Images array must not exceed 3 URLs' }).optional(),
  // video: z.string().url().optional().nullable()
});
