import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import * as FTP from 'basic-ftp';
import { createReadStream } from 'fs';
import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const ftpClient = new FTP.Client();

export async function POST(req:any) {
  try {
    const data = await req.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const tempFilePath = path.join('/tmp', file.name); // Temporary file path

    // Write the file to the temporary location
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(tempFilePath, buffer);

    await ftpClient.access({
      host: "46.28.46.155", // Use your domain here
      user: "u166069102.Krish",
      password: "BarterClub&2611Z",
      port: 21,
      secure: true,
      secureOptions: { rejectUnauthorized: false }
    });

    // Upload the file from the temporary location
    await ftpClient.uploadFrom(createReadStream(tempFilePath), `/upload/${file.name}`);

    // Clean up the temporary file
    await fs.unlink(tempFilePath);

    return NextResponse.json({ message: 'File uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('FTP upload error:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  } finally {
    ftpClient.close();
  }
}
