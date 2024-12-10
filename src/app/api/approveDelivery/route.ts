import { NextResponse, NextRequest } from "next/server";
import Order from "@/lib/models/order.model";
import EscrowTransaction from "@/lib/models/esCrow.model";
import User from "@/lib/models/user.model";
import { sendOrderNotificationEmail } from "@/lib/email";
import Transaction from "@/lib/models/transaction.model";
import Product from "@/lib/models/product.model";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest){
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

    const { orderId } = await req.json();

    console.log("approveDelivery", orderId);

  try {
    const order = await Order.findById(orderId);
    if (!order || order.status !== "pending_delivery") {
      return NextResponse.json({ message: "Invalid order or status" }, { status: 400 });
    }

    const escrowTransaction = await EscrowTransaction.findOne({ order: orderId });
    if (!escrowTransaction || escrowTransaction.status !== "pending_payment") {
      return NextResponse.json({ message: "Escrow transaction not found or invalid" }, { status: 400 });
    }

    const seller = await User.findById(order.seller);
    seller.balance += escrowTransaction.amountHeld;
    await seller.save();

    const buyer = await User.findById(order.buyer);

    order.status = "delivered";
    escrowTransaction.status = "payment_completed";
    await order.save();
    await escrowTransaction.save();

    console.log("hitting transaction");
    // Create a transaction record for the seller
    const product = await Product.findById(order.product);
    const sellerTransaction = new Transaction({
      userId: seller._id,
      amount: 'Sell product' ,  // Amount received by the seller (positive for earnings)
      transactionType: 'Sell',
      points: escrowTransaction.amountHeld,
      razorpayPaymentId: "selling product", // Set this if you have a payment ID
      description: `Sold ${product.title} and earned ${escrowTransaction.amountHeld} points.`, // Add a meaningful description
      orderId: order._id // Link the order ID
    });
   console.log("sellertransaction",sellerTransaction);

    // Save the transactions
     await sellerTransaction.save();

    // Update transaction history for both users
    seller.transactionHistory.push(sellerTransaction._id);

    const sellerEmailContent = `
      <p>Order Completed! The buyer has confirmed delivery for <strong>${product.title}</strong>. Points have been credited to your account.</p>
    `;

    const buyerEmailContent = `
        <p>Order Completed! You have confirmed delivery for <strong>${product.title}</strong>. Payment has been released to the seller.</p>
        `;

    await sendOrderNotificationEmail({
      recipientEmail: seller.email,
      subject: `Order Completed for "${product.title}"`,
      htmlContent: sellerEmailContent,
    });

    await sendOrderNotificationEmail({
      recipientEmail: buyer.email,
      subject: `Order Completed for "${product.title}"`,
      htmlContent: buyerEmailContent,
    });

    return NextResponse.json({ message: "Delivery confirmed and payment released" }, { status: 200 });

  } catch (error: any) {
    console.error("Error confirming delivery:", error.message);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}