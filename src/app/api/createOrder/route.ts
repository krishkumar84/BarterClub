import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import { NextResponse } from 'next/server';
import Product from '@/lib/models/product.model';
import Order from '@/lib/models/order.model';
import Transaction from '@/lib/models/transaction.model';

connect();
export async function POST(req:Request){
  const { sessionClaims} = auth();
    const userId = (sessionClaims?.userId as any)?.userId;
    console.log("userid hello",userId);
    const body = await req.json();
    const {productId } = body;
    console.log("productid",productId);
    console.log("userid", userId);
    try {
        // Find buyer and seller by their IDs
        const buyer = await User.findById(userId);
        const product = await Product.findById(productId);
        const sellerId = product?.owner;
        const seller = await User.findById(sellerId);
        const points = product?.price;
    
        if (!buyer || !seller || !product) {
          throw new Error("Invalid buyer, seller, or product");
        }
        console.log("buyer",buyer);
        console.log("point",points);
        console.log("product",buyer.balance);
    
        // Check if the buyer has enough points
        if (buyer.balance < points) {
          return NextResponse.json({ message: "Insufficient points for the transaction" }, { status: 400 });
          throw new Error("Insufficient points for the transaction");
        }
        console.log("buyer",buyer);
        console.log("product",product);
        console.log("seller",seller);
        console.log("points",points);
        // Create the order
        const order = new Order({
          product: product._id,
          buyer: buyer._id,
          seller: seller._id,
          pointsExchanged: points
        });
       console.log("order",order);
        // Update points between buyer and seller
        buyer.balance -= points;
        seller.balance += points;


        console.log("buyer",buyer);
        console.log("hitting trancaction");
        // Create a transaction record for the buyer
    const buyerTransaction = new Transaction({
      userId: buyer._id,
      amount: 'Purchase',  // Amount spent by the buyer (negative for spending)
      transactionType: "Buy",
      points: -points, // Barter points spent
      razorpayPaymentId: "buying product", // Set this if you have a payment ID
      description: `Purchased ${product.title} for ${points} points.`, // Add a meaningful description
      orderId: order._id // Link the order ID
    });

    console.log("buyertransaction",buyerTransaction);

    console.log("hitting transaction");
    // Create a transaction record for the seller
    const sellerTransaction = new Transaction({
      userId: seller._id,
      amount: 'Sell product' ,  // Amount received by the seller (positive for earnings)
      transactionType: 'Sell',
      points: points,
      razorpayPaymentId: "selling product", // Set this if you have a payment ID
      description: `Sold ${product.title} and earned ${points} points.`, // Add a meaningful description
      orderId: order._id // Link the order ID
    });
   console.log("sellertransaction",sellerTransaction);

    // Save the transactions
    await buyerTransaction.save();
    await sellerTransaction.save();

    // Update transaction history for both users
    buyer.transactionHistory.push(buyerTransaction._id);
    seller.transactionHistory.push(sellerTransaction._id);
    
        // Save the order and the updated users
        await order.save();
        await buyer.save();
        await seller.save();
    
        console.log("Order created successfully:", order);
       return NextResponse.json({ order }, { status: 201 });
      } catch (error:any) {
        console.error("Error creating order:", error.message);
       return  NextResponse.json({ message: error.message }, { status: 500 });
      }
}