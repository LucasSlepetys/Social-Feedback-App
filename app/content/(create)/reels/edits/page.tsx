'use client'; //indicates that this file is for Next.js client-side operations.
import {
  PreviewSelectedFile,
  useParamsForFileInfo,
} from './FileSelectedPreview'; // Imports a component that previews selected files.
import { FloatingActionButton, NavigateBackButton } from '@/app/_components'; // Imports custom UI components for floating action and navigation back buttons.
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useState } from 'react'; // Imports the useState hook from React for state management.
import { DefaultSession } from 'next-auth';

//extends default session return from next-auth to contain user id
interface User extends DefaultSession {
  id: string;
}

// Defines a type for a feedback question, which includes the question text and two answer options.
type FeedbackQuestion = {
  question: string;
  answers: [string, string];
};

// Placeholder function for handling the submission of the video along with the feedback questions.
const createVideo = async (
  createdById: string,
  link: string,
  feedbackQuestions: FeedbackQuestion[]
) => {
  try {
    const res = await axios.post(`/api/video`, {
      createdById: createdById,
      link: link,
      feedbackQuestions: feedbackQuestions,
    });
    console.log(res);
  } catch (error: any) {
    console.log(error);
  }
};

// Main component for editing feedback questions in a video creation interface.
const VideoFeedbackQuestionsEditor = () => {
  //get file info from url:
  const { fileSrc } = useParamsForFileInfo();
  //useSession hook from next auth to get cookies from current user
  const { data: session } = useSession();
  // useState hook to manage an array of feedback questions.
  const [feedbackQuestions, setFeedbackQuestions] = useState<
    FeedbackQuestion[]
  >([{ question: '', answers: ['', ''] }]);

  // Function to append a new, empty feedback question to the state.
  const handleAddFeedbackQuestion = () => {
    setFeedbackQuestions([
      ...feedbackQuestions,
      { question: '', answers: ['', ''] },
    ]);
  };

  // Function to update the text of a question or its answer options based on user input.
  const handleQuestionChange = (
    questionIdx: number,
    updatedText: string,
    answerIdx?: number
  ) => {
    const updatedFeedbackQuestions = [...feedbackQuestions];
    if (answerIdx !== undefined) {
      // Update the text of a specific answer option.
      updatedFeedbackQuestions[questionIdx].answers[answerIdx] = updatedText;
    } else {
      // Update the text of the question itself.
      updatedFeedbackQuestions[questionIdx].question = updatedText;
    }
    setFeedbackQuestions(updatedFeedbackQuestions);
  };

  //call async function to make server request to create video
  const submitVideoWithFeedbackQuestions = () => {
    const user: User = session?.user as User;
    const userID = user?.id;
    createVideo(userID, fileSrc, feedbackQuestions);
    alert('Video has been created');
    try {
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Render method that lays out the components and their interactions on the page.
  return (
    <div className='relative flex flex-col items-center min-h-screen bg-gray-100 p-4'>
      <NavigateBackButton />
      <PreviewSelectedFile />
      <FeedbackQuestionsForm {...{ feedbackQuestions, handleQuestionChange }} />
      <ConditionalAddQuestionButton
        onClick={handleAddFeedbackQuestion}
        hideButton={feedbackQuestions.length >= 3}
      />
      <FloatingActionButton onClick={submitVideoWithFeedbackQuestions} />
    </div>
  );
};

//!----------------------- Conditional Add Question Button Component -----------------------

// Defines the props for the ConditionalAddQuestionButton component.
interface ConditionalAddQuestionButtonProps {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  hideButton: boolean;
}

// Component for rendering a button that conditionally appears based on the 'hideButton' prop.
const ConditionalAddQuestionButton = ({
  onClick: handleClick,
  hideButton,
}: ConditionalAddQuestionButtonProps) => {
  return (
    <button
      type='button'
      onClick={handleClick}
      className={`${
        hideButton ? 'hidden' : 'block'
      } w-full bg-black text-white p-2 rounded-md`}
    >
      Add New Feedback Question
    </button>
  );
};

//!----------------------- Feedback Questions Form Component -----------------------

// Defines the props for the FeedbackQuestionsForm component.
interface FeedbackQuestionsFormProps {
  feedbackQuestions: FeedbackQuestion[];
  handleQuestionChange: Function;
}

// Component for rendering a form that displays all the feedback questions and allows editing.
const FeedbackQuestionsForm = ({
  feedbackQuestions,
  handleQuestionChange,
}: FeedbackQuestionsFormProps) => {
  return (
    <form className='flex flex-col justify-center items-center w-2/3 my-10'>
      {feedbackQuestions.map((feedbackQuestion, questionIdx) => {
        const { question, answers } = feedbackQuestion;
        return (
          <div key={questionIdx}>
            <p className='ml-2 mt-4 mb-2 text-lg font-bold'>
              Question {questionIdx + 1}:
            </p>
            <FeedbackQuestionInput
              {...{ questionIdx, question, handleQuestionChange }}
            />
            <div className='flex gap-4'>
              {answers.map((answerOption, answerIdx) => (
                <FeedbackAnswerInput
                  key={answerIdx}
                  {...{
                    question: answerOption,
                    answerIdx,
                    questionIdx,
                    handleQuestionChange,
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}
    </form>
  );
};

//!----------------------- Feedback Question Input Component -----------------------

// Defines the props for the FeedbackQuestionInput component.
interface FeedbackQuestionInputProps {
  questionIdx: number;
  question: string;
  handleQuestionChange: Function;
}

// Component for rendering an input field for editing a single feedback question.
const FeedbackQuestionInput = ({
  questionIdx,
  question,
  handleQuestionChange,
}: FeedbackQuestionInputProps) => {
  return (
    <input
      type='text'
      placeholder='Enter your question'
      value={question}
      onChange={(e) => handleQuestionChange(questionIdx, e.target.value)}
      className='w-full py-2 px-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
    />
  );
};

//!----------------------- Feedback Answer Input Component -----------------------

// Extends the FeedbackQuestionInputProps with an additional 'answerIdx' property.
interface FeedbackAnswerInputProps extends FeedbackQuestionInputProps {
  answerIdx: number;
}

// Component for rendering an input field for editing a single feedback answer.
const FeedbackAnswerInput = ({
  questionIdx,
  answerIdx,
  question,
  handleQuestionChange,
}: FeedbackAnswerInputProps) => {
  return (
    <input
      key={answerIdx}
      type='text'
      placeholder={`Answer ${answerIdx + 1}`}
      value={question}
      onChange={(e) =>
        handleQuestionChange(questionIdx, e.target.value, answerIdx)
      }
      className='w-1/2 py-2 px-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
    />
  );
};

export default VideoFeedbackQuestionsEditor; // Exports the main VideoFeedbackQuestionsEditor component.
