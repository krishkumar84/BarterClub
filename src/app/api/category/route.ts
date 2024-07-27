"use server"
import Category from "@/lib/models/category.model";
import { CreateCategoryParams } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/lib/db";

connect();

export async function POST(req:NextRequest,res:NextResponse){
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