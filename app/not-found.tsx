'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const router = useRouter();
  const [hasAuthToken, setHasAuthToken] = useState(false);

  useEffect(() => {
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('authToken='));
    setHasAuthToken(!!authToken);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-2xl px-8 py-16 bg-black/40 rounded-lg shadow-2xl text-center relative overflow-hidden border border-gray-800">
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        
        {/* 404 Text */}
        <h1 className="text-9xl font-bold text-[#21ABCD] mb-4">404</h1>
        
        {/* Main Content */}
        <div className="relative">
          <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push(hasAuthToken ? '/dashboard' : '/login')}
              className="block w-full px-6 py-3 text-white bg-[#21ABCD] hover:bg-[#1C96B5] rounded-lg transition-all duration-200 hover:scale-[1.02]"
            >
              {hasAuthToken ? 'Return to Dashboard' : 'Go to Login'}
            </button>
            
            <button
              onClick={() => router.back()}
              className="block w-full px-6 py-3 text-[#21ABCD] bg-gray-900 border border-[#21ABCD]/20 rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-[#21ABCD]/20 rounded-full blur-sm" />
        <div className="absolute bottom-0 right-0 w-24 h-24 translate-x-1/3 translate-y-1/3 bg-[#21ABCD]/20 rounded-full blur-sm" />
      </div>
    </div>
  );
} 