import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Holdings CTC Support
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Get help with all your Holdings CTC applications. Submit tickets, track progress, 
          and find answers in our comprehensive knowledge base.
        </p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Support Portal
        </h2>
        <p className="text-gray-600">
          This is a simplified version to test rendering.
        </p>
      </div>
    </div>
  );
};

export default Home;
