import { connect } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import Order from '@/lib/models/order.model';
import User from '@/lib/models/user.model';
import Product from '@/lib/models/product.model';
import { sendOrderNotificationEmail } from '@/lib/email';
import EscrowTransaction from "@/lib/models/esCrow.model";
import Transaction from "@/lib/models/transaction.model";

connect();

export async function POST(req: Request) {
  try {
    const { sessionClaims } = auth();
    console.log(sessionClaims)
    const userId = (sessionClaims?.userId as { userId: string }).userId;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {orderId, status} = await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending') {
      return NextResponse.json({ message: 'Order status cannot be updated' }, { status: 400 });
    }

    if(order.seller.toString() !== userId) {
      return NextResponse.json({ message: 'Unauthorized seller' }, { status: 401 });
    }

    const buyer = await User.findById(order.buyer);
    const product = await Product.findById(order.product);
    const sellerId = product?.owner;
    if(sellerId.toString() != order.seller.toString()) {
        console.log(sellerId, order.seller)
        return NextResponse.json({ message: 'Unauthorized product owner' }, { status: 401 });
    }
    const seller = await User.findById(sellerId);
    if(status == 'rejected'){
      const escrowTransaction = await EscrowTransaction.findOne({ order: orderId });
    if (!escrowTransaction || escrowTransaction.status !== "pending_payment") {
      return NextResponse.json({ message: "Escrow transaction not found or invalid" }, { status: 400 });
    }
    buyer.balance += escrowTransaction.amountHeld;
    await buyer.save();
    const buyerTransaction = new Transaction({
      userId: buyer._id,
      amount: 'Point Refund' ,  
      transactionType: 'Refund',
      points: escrowTransaction.amountHeld,
      razorpayPaymentId: "amount refunded", 
      description: `Amount refund of  ${product.title} of ${escrowTransaction.amountHeld} points.`, 
      orderId: order._id 
    });
    await buyerTransaction.save();
    buyer.transactionHistory.push(buyerTransaction._id);
    }

    order.status = status;
    await order.save();

    const sellerEmailContent = `
    <h1>New Order Alert From BarterClub</h1>
    <p>Hello ${seller.Name},</p>
    <p>You have <strong>${status}</strong> order for your product <strong>${product.title}</strong> in Exchange of ${order.pointsExchanged} Barter points.</p>
    <p><strong>Buyer Details:</strong></p>
    <ul>
      <li>Name: ${buyer.Name}</li>
      <li>Email: ${buyer.email}</li>
      <li>Phone: ${buyer.phone}</li>
      <li>Address: ${buyer.Address}</li>
    </ul>
    <p><strong>Product Details:</strong></p>
    <ul>
      <li>Title: ${product.title}</li>
      <li>Price: ${product.price}</li>
      <li>Delivery: ${product.delivery}</li>
      <li><a href="https://barterclub.in/product/${product._id}"><img src="${product.images[0]}" alt="Product Image of ${product.title}" width="300" height="300" style="display: block; margin: auto;"></a></li>
    </ul>
  `;

  // Email content for the buyer
  const buyerEmailContent = `
    <h1>Order Created</h1>
    <p>Hello ${buyer.Name},</p>
    <p>Your order for <a href="https://barterclub.in/product/${product._id}"><strong>${product.title}</strong></a> has been ${status} ${status=='rejected' ? 'and amount will be refunded' : '.'}</p>
    <p>You can contact seller now</p>
    <p><strong>Seller Details:</strong></p>
    <ul>
      <li>Name: ${seller.Name}</li>
      <li>Email: ${seller.email}</li>
      <li>Phone: ${seller.phone}</li>
      <li>Address: ${seller.Address}</li>
    </ul>
  `;

  console.log("sending mail")

  // Send emails to both buyer and seller
  await sendOrderNotificationEmail({
    recipientEmail: seller.email,
    subject: `New Order for Your Product "${product.title}"`,
    htmlContent: sellerEmailContent,
  });
 console.log("sending second")
 console.log(buyer.email)
 console.log(`Order Created for "${product.title}"`)
  console.log(buyerEmailContent)
  await sendOrderNotificationEmail({
    recipientEmail: buyer.email,
    subject: `Order Created for "${product.title}"`,
    htmlContent: buyerEmailContent,
  });
  
      console.log("Order created successfully:", order);

    return NextResponse.json({ message: 'Order status updated successfully' });
    
  } catch (error: any) {
    console.error('Error updating points:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
