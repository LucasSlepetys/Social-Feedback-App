'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { IoMdArrowRoundBack } from 'react-icons/io';

const EditQuestions = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [questions, setQuestions] = useState([
    { question: '', answer_1: '', answer_2: '' },
  ]);

  const src = params.get('src') || ' ';
  const imgName = params.get('name') || 'Selected img';

  const addNewQuestion = () => {
    setQuestions([...questions, { question: '', answer_1: '', answer_2: '' }]);
  };

  const handleChange = (
    index: number,
    field: keyof (typeof questions)[0],
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    //submits all questions and src and imgName to server
  };

  return (
    <div className='relative flex flex-col items-center min-h-screen bg-gray-100 p-4'>
      <button
        onClick={() => router.back()}
        className='absolute shadow-md top-4 left-4 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-full hover:bg-gray-300'
      >
        <IoMdArrowRoundBack size={24} />
      </button>
      <div className='w-3/5 aspect-reel mt-12 border border-dashed'>
        <Image
          src={src} // Source set to file's preview URL
          alt={imgName} // Alt text for accessibility
          width={200} // Width of the preview image
          height={300} // Height of the preview image
          layout='responsive' // Responsive layout for the image
        />
      </div>
      <form className='flex flex-col justify-center items-center w-2/3 mt-10'>
        {questions.map((qts, index) => {
          return (
            <NewQuestionInputs
              handleChange={handleChange}
              {...qts}
              index={index}
              key={index}
            />
          );
        })}
      </form>
      <button
        type='button'
        onClick={addNewQuestion}
        className={`${
          questions.length < 3 ? 'block' : 'hidden'
        } w-full bg-black text-white p-2 rounded-md`}
      >
        Add New Question
      </button>
      <button
        type='button'
        onClick={handleSubmit}
        className='fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full'
      >
        Publish
      </button>
    </div>
  );
};

interface Props {
  question: string;
  answer_1: string;
  answer_2: string;
  index: number;
  handleChange: Function;
}

const NewQuestionInputs = ({
  question,
  answer_1,
  answer_2,
  index,
  handleChange,
}: Props) => {
  return (
    <div key={index} className='mb-4'>
      <label htmlFor={`question_${index}`} className='text-lg font-semibold'>
        Question {index + 1}
      </label>
      <input
        type='text'
        id={`question_${index}`}
        placeholder='Enter question'
        value={question}
        onChange={(e) => handleChange(index, 'question', e.target.value)}
        className='w-full py-2 px-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
      />
      <div className='grid gap-2 border border-gray-200 p-2 my-2 rounded-md'>
        <input
          type='text'
          placeholder='Enter Answer'
          value={answer_1}
          onChange={(e) => handleChange(index, 'answer_1', e.target.value)}
          className='w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
        />
        <input
          type='text'
          placeholder='Enter Answer'
          value={answer_2}
          onChange={(e) => handleChange(index, 'answer_2', e.target.value)}
          className='w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
        />
      </div>
    </div>
  );
};

export default EditQuestions;
