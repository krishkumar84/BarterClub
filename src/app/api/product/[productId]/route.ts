import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Category from '@/lib/models/category.model';

connect();

interface User {
  userId: string;
}
const populateProduct = (query: any) => {
    return query
      .populate({ path: 'owner', model: User, select: '_id Name' })
      .populate({ path: 'category', model: Category, select: '_id name' })
  };

 export async function GET(req: NextRequest , { params }: { params: { productId: string }}) {
    const { productId } = params;

  // Validate the productId
  if (!productId || typeof productId !== 'string') {
    return NextResponse.json(createError(400, 'Invalid or missing product ID'), { status: 400 });
  }
  
    try {
      const product = await populateProduct(Product.findById(productId));
  
      if (!product) {
        return NextResponse.json(createError(404, 'Product not found'));
      }
      // console.log("hello",product);
  
      return NextResponse.json(product);
    } catch (error: any) {
      return NextResponse.json(createError(500, error.message));
    }
  }


  export async function DELETE(req: NextRequest , { params }: { params: { productId: string }}) {
    const { productId } = params;
    // console.log(req.body)

    const { clerkId } = await req.json();
 
    // console.log(clerkId,productId);
    const { userId: clerkUserId } : { userId: string | null } = auth();
    const { sessionClaims} = auth();
    const mongoId: User = sessionClaims?.userId as User;
    console.log("hello")
    console.log(clerkUserId,clerkId);
    if(clerkUserId !== clerkId){
      return NextResponse.json(createError(403, 'Unauthorized'));
    }
    
    // Validate the productId
    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(createError(400, 'Invalid or missing product ID'), { status: 400 });
    }
    
      try {
          const post = await Product.findById(productId);
          if (!post) {
            return NextResponse.json(createError(404, 'Product not found'));
          }
          if(post.userId !== mongoId.userId){
            return NextResponse.json(createError(403, 'Unauthorized'));
          }
  
          const deletePost = await Product.findByIdAndDelete(productId);
  
          return NextResponse.json({ data: deletePost, message: "Product Deleted Successfully" });
  
      } catch (error: any) {
        return NextResponse.json(createError(500, error.message));
      }
    }
      
  