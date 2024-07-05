import { NextApiRequest, NextApiResponse } from 'next';
import Product from '@/lib/models/product.model';
import createError from '@/lib/createError';
import { NextRequest,NextResponse } from "next/server";
import {auth } from '@clerk/nextjs/server';

export const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
    const { userId, getToken } = auth();

  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error: any) {
    res.status(500).json(createError(500, error.message));
  }
};

export const createProduct = async (req:NextRequest, res: NextResponse) => {

  const  body  = await req.json();
  
  const newProduct = new Product({
    ...body,
  });

  try {
    const savedProduct = await newProduct.save();
    return NextResponse.json(savedProduct);
  } catch (error: any) {
    return NextResponse.json(createError(500, error.message));
  }
};

// Export named functions
export const GET = getProducts;
export const POST = createProduct;
