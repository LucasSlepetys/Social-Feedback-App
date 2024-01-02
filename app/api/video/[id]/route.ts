import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { Props } from './Props';

//gets video with given id
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

//delete video //all other relations are deleting due to onDelete prisma
export async function DELETE(request: NextRequest, { params: { id } }: Props) {
  const videoId = parseInt(id);

  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video) {
    return NextResponse.json(
      { error: 'Video not found with given id' },
      { status: 404 }
    );
  }

  // Perform the deletion of the video along with its related entities (since cascading delete is set)
  await prisma.video.delete({
    where: {
      id: videoId,
    },
  });

  return NextResponse.json(
    { message: 'Video deleted successfully' },
    { status: 200 }
  );
}
