'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

interface DeleteUserProps {
  dialog: boolean;
  setDialog: (show: boolean) => void;
  deleteUser: () => void;
  loading: boolean;
}

export default function DeleteUser({ dialog, setDialog, deleteUser, loading }: DeleteUserProps) {
  if (!dialog) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-sm w-full">
        <div className="flex justify-end p-2">
          <button
            onClick={() => setDialog(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 pb-6 text-center">
          <div className="mb-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XMarkIcon className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Are you sure you want to delete this user?
            </h2>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={deleteUser}
              disabled={loading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {loading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setDialog(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              No, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}