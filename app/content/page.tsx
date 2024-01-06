'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import RouteBackBtn from '../_components/RouteBackBtn';

const ContentSelector = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  //checks if the param on URL indicates that the user is a creator or not
  const isCreator: boolean = searchParams.get('option') === 'create';

  return (
    <div className='relative flex flex-col items-center justify-center h-screen bg-gray-100 p-4'>
      <RouteBackBtn />
      <div className='bg-white rounded-lg shadow-lg p-8'>
        <h1 className='text-2xl font-bold text-center text-gray-700 mb-4'>
          {isCreator
            ? 'What type of content do you feel like creating today?'
            : 'What type of content do you feel like watching today?'}
        </h1>
        <div className='flex justify-between gap-4 mb-8'>
          <button
            onClick={() => router.push('/content/reels')}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          >
            Reels
          </button>
          <button className='bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'>
            Feed
          </button>
        </div>
        <div className='flex justify-center'>
          <button className='bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full aspect-square'>
            Stories
          </button>
        </div>
        <p className='text-center text-gray-600 mt-4 italic'>
          Twiter, x, threads
        </p>
      </div>
    </div>
  );
};

export default ContentSelector;
