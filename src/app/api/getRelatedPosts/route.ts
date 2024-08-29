import Product from '@/lib/models/product.model';
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Category from '@/lib/models/category.model';
import { NextApiRequest } from 'next';
import {NextRequest, NextResponse } from 'next/server';

connect();

const populateProduct = (query: any) => {
    return query
      .populate({ path: 'owner', model: User, select: '_id Name' })
      .populate({ path: 'category', model: Category, select: '_id name' })
  };


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url ?? '');
  const categoryId = searchParams.get('categoryId');
  const postId = searchParams.get('postId');
    const page = 1;
    const limit = 3;
    try{
    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [{ category: categoryId }, { _id: { $ne: postId } }] }

    const postQuery = Product.find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)

    const posts = await populateProduct(postQuery)
    const postsCount = await Product.countDocuments(conditions)


    return NextResponse.json({
      data: JSON.parse(JSON.stringify(posts)), 
      totalPages: Math.ceil(postsCount / limit) })
    
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message });
    }
  }
