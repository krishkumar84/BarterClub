import { connect } from '@/lib/db';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import EscrowTransaction from '@/lib/models/esCrow.model';
import User from '@/lib/models/user.model';
import Product from '@/lib/models/product.model';

connect();

export async function GET(req: Request) {
  try {
    const data = await EscrowTransaction.aggregate([
        // Lookup buyer details
        {
          $lookup: {
            from: "users",
            localField: "buyer",
            foreignField: "_id",
            as: "buyerDetails",
          },
        },
        { $unwind: "$buyerDetails" }, // Ensures a single document for buyer details
      
        // Lookup seller details
        {
          $lookup: {
            from: "users",
            localField: "seller",
            foreignField: "_id",
            as: "sellerDetails",
          },
        },
        { $unwind: "$sellerDetails" }, // Ensures a single document for seller details
      
        // Lookup product details
        {
          $lookup: {
            from: "products",
            localField: "product",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Ensures a single document for product details
      
        // Project required fields
        {
          $project: {
            _id: 1,
            productName: "$productDetails.title", // Access title from product
            amountHeld: 1,
            status: 1,
            buyerName: { $concat: ["$buyerDetails.Name"] }, // Concatenate name from user
            sellerName: { $concat: ["$sellerDetails.Name"] }, // Concatenate name from user
            buyerEmail: "$buyerDetails.email", // Access email directly
            sellerEmail: "$sellerDetails.email", // Access email directly
          },
        },
      ]);
      

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch transactions' });
  }
}