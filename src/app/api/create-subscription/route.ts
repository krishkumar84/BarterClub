import Razorpay from "razorpay";
import { NextResponse } from "next/server";



export async function POST(){
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "",
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const result = await instance.subscriptions.create({
        plan_id: process.env.STARTUP_MONTHLY_SUBSCRIPTION_PLAN_ID || " ",
        total_count: 1,
        customer_notify: 1,
        addons: [],
    });
    return NextResponse.json(result);
}