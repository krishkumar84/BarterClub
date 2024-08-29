import Product from '@/lib/models/product.model';
import { connect } from '@/lib/db';
import {auth } from '@clerk/nextjs/server';
import User from '@/lib/models/user.model'
import Category from '@/lib/models/category.model';
import { NextApiRequest } from 'next';
import { NextRequest, NextResponse } from 'next/server';

connect();

const populateProduct = (query: any) => {
    return query
      .populate({ path: 'owner', model: User, select: '_id Name' })
      .populate({ path: 'category', model: Category, select: '_id name' })
  };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url ?? '');
  const userId = searchParams.get('userId');
  console.log(userId);
    const page = 1;
    const limit = 3;
    try{
        const conditions = { owner: userId }
        const skipAmount = (page - 1) * limit
    
        const postQuery = Product.find(conditions)
          .sort({ createdAt: 'desc' })
          .skip(skipAmount)
          .limit(limit)
    
          const posts = await populateProduct(postQuery)
          const postsCount = await Product.countDocuments(conditions)

          console.log(posts);
    
    return NextResponse.json({
      data: JSON.parse(JSON.stringify(posts)), 
      totalPages: Math.ceil(postsCount / limit) })
    
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: (error as Error).message });
    }
  }
