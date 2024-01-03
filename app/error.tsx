'use client';
import React from 'react';

interface Props {
  error: Error;
  reset: () => void;
  status: number; // Add status prop to get the HTTP status code
}

const ErrorPage = ({ error, reset, status }: Props) => {
  console.log('Error!!', error);
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold mb-4'>Error {status}</h1>
      <p className='text-red-500'>{error.message}</p>
      <button
        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none'
        onClick={() => reset()}
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorPage;
