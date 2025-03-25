import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, ArrowLeftCircle, HelpCircle } from 'lucide-react';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <AlertTriangle size={60} className="text-red-500 mb-4" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 text-center mb-6">Sorry! Team CodeCanvas would be working on this page or it may have been moved. Project Sahyog has many features except this. We would update this very soon.</p>
      <div className="flex space-x-4">
        <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800">
          <ArrowLeftCircle size={20} className="mr-2" /> Go Back
        </button>
        <button onClick={() => navigate('/')} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <Home size={20} className="mr-2" /> Go to Home
        </button>
        <button className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          <HelpCircle size={20} className="mr-2" /> Report a Problem
        </button>
      </div>
      <p className="mt-8 text-gray-500">Need help? Contact our support team for assistance.</p>
    </div>
  );
};

export default Error404;
