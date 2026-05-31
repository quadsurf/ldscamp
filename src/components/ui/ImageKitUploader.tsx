'use client';

import React, { useState } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit/auth');
    if (!response.ok) {
      throw new Error(`Authentication request failed with status: ${response.status}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface ImageKitUploaderProps {
  onSuccess: (url: string) => void;
  onError?: (err: any) => void;
}

export const ImageKitUploader: React.FC<ImageKitUploaderProps> = ({ onSuccess, onError }) => {
  const [uploading, setUploading] = useState(false);

  const handleSuccess = (res: any) => {
    setUploading(false);
    onSuccess(res.url);
  };

  const handleError = (err: any) => {
    setUploading(false);
    if (onError) onError(err);
  };

  const handleUploadStart = () => {
    setUploading(true);
  };

  if (!urlEndpoint || !publicKey) {
    return <div className="text-red-500 text-sm">ImageKit configuration missing in environment.</div>;
  }

  return (
    <div className="w-full">
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        <IKUpload
          fileName="profile-pic"
          tags={["profile-picture"]}
          useUniqueFileName={true}
          onSuccess={handleSuccess}
          onError={handleError}
          onUploadStart={handleUploadStart}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </IKContext>
      {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
    </div>
  );
};
