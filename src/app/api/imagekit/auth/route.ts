import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export const GET = async () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json({ error: 'ImageKit credentials missing' }, { status: 500 });
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to authenticate with ImageKit' }, { status: 500 });
  }
};
