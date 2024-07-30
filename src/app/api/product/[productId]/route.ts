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
  