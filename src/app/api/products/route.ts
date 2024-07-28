import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';

connect();


export async function POST(req: NextRequest, res: NextResponse) {
  console.log("hitted");
  // console.log(req.json());
  const {clerkId,userId,imageUrl,body} = await req.json();
  console.log(clerkId,userId,imageUrl,body);
  console.log(userId.userId);
  const { userId: clerkUserId } : { userId: string | null } = auth();
  const { sessionClaims} = auth();
  const mongoId: string = sessionClaims?.userId as string;
  if(clerkUserId !== clerkId && mongoId !== userId.userId){
    return NextResponse.json(createError(403, 'Unauthorized'));
  }
  console.log(body);
  const newProduct = new Product({
    clerkId,
    userId:userId.userId,
    category: body.categoryId,
    images: imageUrl,
    ...body
  });

  try {
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct);
  } catch (error: any) {
    return NextResponse.json(createError(500, error.message));
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(createError(500, error.message));
  }
}
