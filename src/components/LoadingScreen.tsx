import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Checking authentication...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
