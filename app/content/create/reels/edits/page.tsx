'use client';
// import { useRouter } from 'next/navigation';
import React from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

const page = () => {
  //   const router = useRouter();
  return (
    <div className='relative flex flex-col items-center h-screen bg-gray-100 p-4'>
      <button
        onClick={() => {
          //   router.back();
        }}
        className='absolute shadow-md top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-300'
      >
        <IoMdArrowRoundBack size={24} />
      </button>
      <div className='w-3/5 aspect-reel mt-12 bg-black'>dfdsf</div>
    </div>
  );
};

export default page;
