import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/Login';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to My React App
          </h1>
        </div>
        <div className="text-center mt-4">
          <Login />
          <Link
            to="/signup"
            className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block"
          >
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
