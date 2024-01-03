'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the homepage after a delay (e.g., 3 seconds)
    const timer = setTimeout(() => {
      router.push('/');
    }, 3000); // 3000 milliseconds (3 seconds)

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts before redirection
    };
  }, [router]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-4xl font-semibold text-gray-800 mb-4'>
          Page Not Found
        </h1>
        <p className='text-gray-600 mb-2'>Redirecting to the homepage...</p>
        <div className='flex justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800'></div>
        </div>
      </div>
    </div>
  );
}
