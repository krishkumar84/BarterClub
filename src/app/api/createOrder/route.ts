import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import { NextResponse } from 'next/server';
import Product from '@/lib/models/product.model';
import Order from '@/lib/models/order.model';

connect();
export async function POST(req:Request){
    const body = await req.json();
    const { buyerId, productId } = body;
    try {
        // Find buyer and seller by their IDs
        const buyer = await User.findById(buyerId);
        const product = await Product.findById(productId);
        const sellerId = product?.owner;
        const seller = await User.findById(sellerId);
        const points = product?.points;
    
        if (!buyer || !seller || !product) {
          throw new Error("Invalid buyer, seller, or product");
        }
    
        // Check if the buyer has enough points
        if (buyer.balance < points) {
          throw new Error("Insufficient points for the transaction");
        }
    
        // Create the order
        const order = new Order({
          product: product._id,
          buyer: buyer._id,
          seller: seller._id,
          pointsExchanged: points
        });
    
        // Update points between buyer and seller
        buyer.balance -= points;
        seller.balance += points;
    
        // Save the order and the updated users
        await order.save();
        await buyer.save();
        await seller.save();
    
        console.log("Order created successfully:", order);
        NextResponse.json({ order }, { status: 201 });
      } catch (error:any) {
        console.error("Error creating order:", error.message);
        NextResponse.json({ message: error.message }, { status: 500 });
      }
}