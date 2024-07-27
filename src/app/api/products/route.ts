import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';

connect();


export async function POST(req: NextRequest, res: NextResponse) {
  const {clerkId,userId,body} = await req.json();
  const { userId: clerkUserId } : { userId: string | null } = auth();
  if(clerkUserId !== clerkId){
    return NextResponse.json(createError(403, 'Unauthorized'));
  }
  console.log(body);
  const newProduct = new Product(body);

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
