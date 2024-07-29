import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
// import * as FTP from 'basic-ftp';
import { randomBytes } from 'crypto';
import path from 'path';
import { getAuth } from "@clerk/nextjs/server";


// const ftpClient = new FTP.Client();

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

    // const tempFilePath = path.join('/tmp', file.name); // Temporary file path
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = data.get('file').name.split('.').pop();
    const uniqueString = randomBytes(4).toString('hex'); // Generate a random 8-character string
    const fileName = `${uniqueString}.${fileExtension}`;

    const tempFilePath = path.join('/tmp', fileName);
    await fs.writeFile(tempFilePath, buffer);

    const publicDir = path.resolve('./public/uploads');
    const publicFilePath = path.join(publicDir, fileName);
    await fs.mkdir(publicDir, { recursive: true });

    // await fs.mkdir(uploadDir, { recursive: true });
    // await fs.writeFile(filePath, buffer);
    await fs.copyFile(tempFilePath, publicFilePath);

    // Delete the original file in /tmp
    await fs.unlink(tempFilePath);

    const fileUrl = `/uploads/${fileName}`; // URL to access the uploaded file
    return NextResponse.json({ message: 'File uploaded successfully', url: fileUrl });
  } catch (error) {
    console.error('FTP upload error:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}
