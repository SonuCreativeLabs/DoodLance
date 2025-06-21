'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ImageTest() {
  const [imgSrc, setImgSrc] = useState('/images/cover-sonu.jpg');
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    console.error('Image failed to load, using fallback');
    setHasError(true);
  };

  // Try different paths if the first one fails
  useEffect(() => {
    if (hasError) {
      console.log('Trying fallback image path');
      setImgSrc('/cover-sonu.jpg');
    }
  }, [hasError]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test</h1>
      <div className="relative w-full h-64 border-2 border-dashed border-gray-400 rounded-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt="Test cover"
          fill
          className="object-cover"
          priority
          onError={handleImageError}
          unoptimized={process.env.NODE_ENV !== 'production'}
        />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p className="font-mono text-sm">
          Current image path: <code>{imgSrc}</code>
        </p>
        {hasError && (
          <p className="text-red-600 mt-2">
            Error: Could not load image. Please check the console for details.
          </p>
        )}
      </div>
    </div>
  );
}
