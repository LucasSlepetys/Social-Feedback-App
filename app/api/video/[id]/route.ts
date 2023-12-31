import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { Props } from './Props';

//!must changes:
//** Implement the functionality of creating up to 3 questions and its answers together with the creation of the video in here*/
//** All within a transaction */

export async function GET(request: NextRequest, { params: { id } }: Props) {
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

  //get the video with its feedback questions and answers
  //returns video
  const videoResponse = await prisma.video.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      feedbackQuestions: {
        include: {
          answers: true,
        },
      },
    },
  });

  return NextResponse.json(videoResponse, { status: 200 });
}
