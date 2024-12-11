"use server"
import Category from "@/lib/models/category.model";
import { CreateCategoryParams } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";
import { redis } from "@/lib/ratelimit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import createError from '@/lib/createError';

connect();

const ratelimit = new Ratelimit({ 
  redis: redis, 
  limiter: Ratelimit.fixedWindow(2, '60s'), 
});
export async function POST(req:NextRequest,res:NextResponse){
    const ip = headers().get('x-real-ip') || req.headers.get('x-forwarded-for');
    const { success, pending, limit, reset, remaining } = await ratelimit.limit(ip!);
    console.log(success, pending, limit, reset, remaining);
    
    if (!success) {
      return NextResponse.json(createError(429, 'Too many requests'));
    }
    const { categoryName }: CreateCategoryParams = await req.json();
    // return NextResponse.json({ name: categoryName } );
    if (!categoryName) {
        return NextResponse.json({ error: 'Category name is required' });
      }
    console.log(categoryName);
    try {
        const newCategory = await Category.create({ name: categoryName });
        return NextResponse.json({ newCategory });    
    }catch(error:any){
        return NextResponse.json(error);
    }   
}

export async function GET(){
    try {
        const categories = await Category.find();
        return NextResponse.json(categories);
    }catch(error:any){
        return NextResponse.json( error);
    }
}