import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';

//Zod schema used to validate body of create new video request
const videoSchema = z.object({
  createdById: z.number(),
  link: z.string().min(5, 'Please add a valid link'),
});

let fetchedVideoIds: number[] = [];
let fetchCounter = 0;
const MAX_FETCHES = 3;

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

export async function POST(request: NextRequest) {
  const body = await request.json();

  //Uses zod schema to check if body of request is valid
  //returns error if it is not valid

  const validation = videoSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  //if all conditions above are met, it creates a new video
  //returns the video created

  const res = await prisma.video.create({
    data: {
      createdBy: { connect: { id: body.createdById } },
      link: body.link,
    },
  });

  return NextResponse.json(res, { status: 201 });
}
