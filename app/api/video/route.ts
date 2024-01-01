import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';

let fetchedVideoIds: number[] = [];
let fetchCounter = 0;
const MAX_FETCHES = 5;

export async function GET(request: NextRequest) {
  // Reset fetchedVideoIds after 10 fetches
  if (fetchCounter >= MAX_FETCHES) {
    fetchedVideoIds = [];
    fetchCounter = 0;
  }

  // Find a single random video that is not the same as the last fetched one
  const randomVideo = await prisma.video.findFirst({
    where: {
      id: {
        not: {
          // Exclude all IDs that have been fetched before
          in: fetchedVideoIds.length > 0 ? fetchedVideoIds : undefined,
        },
      },
    },
    orderBy: {
      // Order the videos randomly
      createdAt: 'desc', // Use any field that suits your requirement for randomness
    },
    //includes the questions and answers of the videos
    include: {
      feedbackQuestions: {
        include: {
          answers: true,
        },
      },
    },
  });

  //if no video was fetched send an error
  if (!randomVideo) {
    return NextResponse.json(
      { error: 'Failed to fetch a random video' },
      { status: 500 }
    );
  }

  fetchedVideoIds.push(randomVideo.id); // Store the fetched video's ID
  fetchCounter++; // Increment fetch counter

  return NextResponse.json(randomVideo, { status: 200 });
}

//Zod schema used to validate body of create new video request
const videoSchema = z.object({
  createdById: z.number(),
  link: z.string().min(5, 'Please add a valid link'),
  feedbackQuestions: z
    .array(
      z.object({
        question: z.string().min(1, 'Please provide a question'),
        answers: z.tuple([
          z.string().min(1, 'Please provide the first answer'),
          z.string().min(1, 'Please provide the second answer'),
        ]),
      })
    )
    .max(3, 'Maximum 3 feedback questions allowed'),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  //Uses zod schema to check if body of request is valid
  //returns error if it is not valid

  const validation = videoSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  //if all conditions above are met then:
  //create a transaction for the videos and questions and answers to be created
  //if one fails everything is undo due to the transaction and an error is sent
  //finally it returns the video created with all the questions and answers

  try {
    const createdVideo = await prisma.$transaction(async (prismaClient) => {
      const { id: videoID } = await prismaClient.video.create({
        data: {
          createdBy: { connect: { id: body.createdById } },
          link: body.link,
        },
      });

      //Gets the feedbackQuestions from request or sets it to an empty array if none are provided
      const feedbackQuestions: {
        question: string;
        answers: [string, string];
      }[] = body.feedbackQuestions || [];

      //create up to 3 feedback questions:
      for (const { question, answers } of feedbackQuestions) {
        //uses the videoID to create a question for that video
        const { id: questionID } = await prismaClient.feedbackQuestion.create({
          data: {
            question: question,
            videoId: videoID,
          },
        });

        //use the questionID to create the two answers for that question
        for (const answer of answers) {
          await prismaClient.answer.create({
            data: {
              text: answer,
              questionId: questionID,
            },
          });
        }
      }
      //returns the video created including its questions and answers
      return prismaClient.video.findUnique({
        where: {
          id: videoID,
        },
        include: {
          feedbackQuestions: {
            include: {
              answers: true,
            },
          },
        },
      });
    });

    return NextResponse.json(createdVideo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Failed to create the video or its questions and answers. Error: ' +
          error,
      },
      { status: 500 }
    );
  }
}
