import React from 'react';
import Link from 'next/link';

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-8xl font-bold text-pink-500 flex justify-center items-center">
          <span>4</span>
          <span role="img" aria-label="sad potato" className="mx-4">
            🥔
          </span>
          <span>4</span>
        </div>
        <h1 className="mt-6 text-5xl font-bold text-gray-800">Error</h1>
        <p className="text-gray-600 text-xl mt-2">Page Not Found</p>
        <div className="mt-6">
          <Link href="/" className="px-6 py-3 bg-pink-500 text-white font-bold rounded-md shadow hover:bg-pink-600">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
