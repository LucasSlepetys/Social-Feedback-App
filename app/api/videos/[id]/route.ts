import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

//Zod Schema used to validate the body of a request
const feedbackQuestionSchema = z.object({
  question: z.string().min(2, 'Please provide a question'),
  answer: z.string().min(1, 'Please provide an answer'),
});

//props to get id from request URL
interface Props {
  params: {
    id: string;
  };
}

//create feedback questions to a video and an answer to that question
export async function POST(request: NextRequest, { params: { id } }: Props) {
  const body = await request.json();

  //Uses zod schema to check if body of request is valid
  //returns error if it is not valid

  const validation = feedbackQuestionSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  //Finds video with the id given in the URL, and checks if video exists
  //returns error if it doesn't

  const video = await prisma.video.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!video)
    return NextResponse.json(
      { error: 'No video exits with that ID' },
      { status: 404 }
    );

  //finds how many feedback questions there are with the videoId equal to the vidoe id passed in the URL
  //returns error if there are already 3

  const numberOfQuestions = await prisma.feedbackQuestion.count({
    where: {
      videoId: parseInt(id),
    },
  });

  if (numberOfQuestions >= 3)
    return NextResponse.json(
      { error: 'Video already contains the maximum number of questions (3)' },
      { status: 400 }
    );

  //if all conditions above are met, it creates transaction for the creation of question and answer
  //if the creation of either one fails both will fail
  //returns created question

  let createdQuestion;
  await prisma.$transaction(async (prisma) => {
    //create the feedback question within a transaction
    createdQuestion = await prisma.feedbackQuestion.create({
      data: {
        videoId: parseInt(id),
        question: body.question,
      },
    });

    // Check if an answer already exists for the created question
    const existingAnswer = await prisma.answer.findFirst({
      where: {
        questionId: createdQuestion.id,
      },
    });

    //if an answer doesn't exists, creates the answer for that feedback question
    if (!existingAnswer) {
      await prisma.answer.create({
        data: {
          questionId: createdQuestion.id,
          text: body.answer,
        },
      });
    }
  });

  return NextResponse.json(createdQuestion, { status: 201 });
}
