'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProjectsPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="mt-2 text-gray-600">Create and manage your interactive avatars</p>
        </div>
        <button
          onClick={() => router.push('/create-avatar')}
          className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors shadow-sm"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Avatar
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empty state */}
        <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <PlusIcon className="w-6 h-6 text-gray-900" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No avatars yet</h3>
            <p className="text-gray-500 mb-4">Get started by creating your first interactive avatar</p>
            <button
              onClick={() => router.push('/create-avatar')}
              className="text-gray-900 hover:text-gray-700 font-medium"
            >
              Create your first avatar →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 