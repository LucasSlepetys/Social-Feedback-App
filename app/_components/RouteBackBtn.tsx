import { useRouter } from 'next/navigation';
import React from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

const RouteBackBtn = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className='absolute shadow-md top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-300'
    >
      <IoMdArrowRoundBack size={24} />
    </button>
  );
};

export default RouteBackBtn;
