import React from 'react';
import Login from '../components/Login';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
