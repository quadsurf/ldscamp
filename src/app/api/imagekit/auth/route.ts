import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || process.env.IMAGEKIT_PUBLIC_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT;

    if (!privateKey || !publicKey || !urlEndpoint) {
      console.error('Missing ImageKit environment variables');
      return NextResponse.json({ error: 'ImageKit configuration is missing' }, { status: 500 });
    }

    const token = crypto.randomUUID();
    const expire = (Math.floor(Date.now() / 1000) + 60 * 30).toString(); // 30 minutes from now
    const signature = crypto.createHmac('sha1', privateKey).update(token + expire).digest('hex');

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey,
      urlEndpoint
    });
  } catch (err) {
    console.error('Error generating ImageKit auth:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
