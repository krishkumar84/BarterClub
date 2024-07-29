import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getAuth } from "@clerk/nextjs/server";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.URL ?? "",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? " ",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
  },
});

export async function POST(req:any) {
  try {
    const { userId } = getAuth(req);
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = data.get('file').name.split('.').pop();
    const uniqueString = randomBytes(4).toString('hex'); // Generate a random 8-character string
    const fileName = `${uniqueString}.${fileExtension}`;
    console.log(file.type);
    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });
    try {
      const response = await r2.send(putObjectCommand);
      const fileUrl = `https://pub-5b7aa644be4a4389bec851ef2147ddce.r2.dev/${fileName}`; 
       return NextResponse.json({ message: 'File uploaded successfully', url: fileUrl });
    } catch (error) {
      console. log ("error:", error);
      return NextResponse. json({ success: false }, { status: 500 });
      }
  } catch (error) {
    console.error('upload error:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
