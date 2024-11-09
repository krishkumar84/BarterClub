import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import { NextResponse } from 'next/server';
import Product from '@/lib/models/product.model';
import Order from '@/lib/models/order.model';
import Transaction from '@/lib/models/transaction.model';
import { sendOrderNotificationEmail } from '@/lib/email';
import EscrowTransaction from '@/lib/models/esCrow.model';

connect();
export async function POST(req:Request){
  const { sessionClaims} = auth();
    const userId = (sessionClaims?.userId as any)?.userId;
    // console.log("userid hello",userId);
    const body = await req.json();
    const {productId } = body;
    // console.log("productid",productId);
    // console.log("userid", userId);
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

       await order.save();
        // Update points between buyer and seller
        buyer.balance -= points;
        // seller.balance += points;

        const escrowTransaction = new EscrowTransaction({
          order: order._id,
          buyer: buyer._id,
          product: product._id,
          seller: seller._id,
          amountHeld: points,
          status: "pending_payment"
        });
    
        await escrowTransaction.save();


        console.log("buyer",buyer);
        console.log("hitting trancaction");
        // Create a transaction record for the buyer
    const buyerTransaction = new Transaction({
      userId: buyer._id,
      amount: 'Purchase', 
      transactionType: "Buy",
      points: -points, // Barter points spent
      razorpayPaymentId: "buying product", // Set this if you have a payment ID
      description: `Purchased ${product.title} for ${points} points.`, // Add a meaningful description
      orderId: order._id // Link the order ID
    });

    console.log("buyertransaction",buyerTransaction);

    console.log("hitting transaction");
    // Create a transaction record for the seller
  //   const sellerTransaction = new Transaction({
  //     userId: seller._id,
  //     amount: 'Sell product' ,  // Amount received by the seller (positive for earnings)
  //     transactionType: 'Sell',
  //     points: points,
  //     razorpayPaymentId: "selling product", // Set this if you have a payment ID
  //     description: `Sold ${product.title} and earned ${points} points.`, // Add a meaningful description
  //     orderId: order._id // Link the order ID
  //   });
  //  console.log("sellertransaction",sellerTransaction);

    // Save the transactions
    await buyerTransaction.save();
    // await sellerTransaction.save();

    // Update transaction history for both users
    buyer.transactionHistory.push(buyerTransaction._id);
    // seller.transactionHistory.push(sellerTransaction._id);
    
        // Save the order and the updated users
        await buyer.save();
        await seller.save();

   const sellerEmailContent = `
      <h1>New Order Alert From BarterClub</h1>
      <p>Hello ${seller.Name},</p>
      <p>You have a new order for your product <strong>${product.title}</strong> in Exchange of ${points} Barter points.</p>
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
       <p>Please confirm the order in your<a href="https://barterclub.in/orders?postId=${product._id}"> dashboard</a>.</p>
    `;

    // Email content for the buyer
    const buyerEmailContent = `
      <h1>Order Created</h1>
      <p>Hello ${buyer.Name},</p>
      <p>Your order for <a href="https://barterclub.in/product/${product._id}"><strong>${product.title}</strong></a> has been created successfully.</p>
      <p>You will receive a confirmation once the seller accepts the order.</p>
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
       return NextResponse.json({ order }, { status: 201 });
      } catch (error:any) {
        console.error("Error creating order:", error.message);
       return  NextResponse.json({ message: error.message }, { status: 500 });
      }
}