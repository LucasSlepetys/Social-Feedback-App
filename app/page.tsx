'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100 p-4'>
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-3xl font-semibold text-center mb-4'>
          What do you feel like doing today?
        </h1>
        <div className='flex flex-col gap-4 sm:flex-row sm:justify-center'>
          <button
            type='button'
            onClick={() => router.push('/content?option=consume')}
            className='px-4 sm:px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
          >
            Consume Content
          </button>
          <button
            type='button'
            onClick={() => router.push('/content?option=create')}
            className='px-4 sm:px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300'
          >
            Create Content
          </button>
        </div>
      </div>
    </div>
  );
}
