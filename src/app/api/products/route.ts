import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Category from '@/lib/models/category.model';

connect();

const populateProduct = (query: any) => {
  return query
    .populate({ path: 'owner', model: User, select: '_id Name' })
    .populate({ path: 'category', model: Category, select: '_id name' })
}

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("hitted");
  // console.log(req.json());
  const {clerkId,userId,imageUrl,owner,body} = await req.json();
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
    owner:owner.userId,
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

export async function GET(req: NextApiRequest, res: NextResponse) {
  const { id } = req.query as { id: string };
  console.log(id);
  if (!id || typeof id !== 'string') {
    return NextResponse.json(createError(400, 'Invalid or missing product ID'));
  }

  try {
    const product = await populateProduct(Product.findById(id));

    if (!product) {
      return NextResponse.json(createError(404, 'Product not found'));
    }
    console.log(product);

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(createError(500, error.message));
  }
}
