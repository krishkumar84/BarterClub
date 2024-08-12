import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Category from '@/lib/models/category.model';

connect();


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

const populateProduct = (query: any) => {
  return query
    .populate({ path: 'owner', model: User, select: '_id Name' })
    .populate({ path: 'category', model: Category, select: '_id name' })
};

export async function GET(req:Request){
  try{
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || '';
  const limit = parseInt(searchParams.get('limit') || '6', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const category = searchParams.get('category') || '';

  const conditions: any = {};

  const postQuery = Product.find(conditions)
  .sort({createdAt:'desc'})
  .skip((page - 1) * limit)
  .limit(limit)

  const posts = await populateProduct(postQuery);
  const postCount = await Product.countDocuments(conditions);

  return NextResponse.json({
    data : JSON.parse(JSON.stringify(posts)),
    totalPages: Math.ceil(postCount / limit),
  });
}catch(error:any){
  return NextResponse.json(createError(500, error.message));
}
}

export async function PUT(req: NextRequest) {
  try {
    const { clerkId, userId, imageUrl, owner,productId, body } = await req.json();
    console.log('Clerk ID:', clerkId);
    console.log('User ID:', userId);
    console.log('Image URL:', imageUrl);
    console.log('Owner:', owner);
    console.log('Product ID:', productId);
    console.log('Body:', body);
    const { userId: clerkUserId } = auth();
    const { sessionClaims } = auth();
    const mongoId: string = sessionClaims?.userId as string;

    if (clerkUserId !== clerkId && mongoId !== userId) {
      return NextResponse.json(createError(403, 'Unauthorized'));
    }

    console.log(productId);

    // Find the product by ID
    const productToUpdate = await Product.findById(productId);
    console.log('Product to Update:', productToUpdate);
    console.log(productToUpdate.userId);
    console.log(userId.userId);
    if (!productToUpdate || productToUpdate.userId !== userId.userId) {
      return NextResponse.json(createError(404, 'Product not found or unauthorized'));
    }

    // Update the product
    console.log('Update Payload:', { ...body, images: imageUrl, owner: owner.userId, category: body.categoryId });
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...body, images: imageUrl, owner: owner.userId, category: body.categoryId },
      { new: true }
    )
    console.log('Updated Product:', updatedProduct);
    return NextResponse.json(updatedProduct._id);
  } catch (error: any) {
    return NextResponse.json(createError(500, error.message));
  }
}