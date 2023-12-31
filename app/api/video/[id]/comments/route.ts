import { NextRequest, NextResponse } from 'next/server';
import { Props } from '../Props';
import { z } from 'zod';
import prisma from '@/prisma/client';

const commentSchema = z.object({
  text: z.string().min(1, 'Please provide a comment'),
  userId: z.number(),
});

//get the comments of a video
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

  //get comments of the video with that id, include the user who commented
  //return the comments
  const comments = await prisma.comment.findMany({
    where: {
      videoId: parseInt(id),
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(comments, { status: 200 });
}

//creates a new comment for a video
export async function POST(request: NextRequest, { params: { id } }: Props) {
  const body = await request.json();

  //Uses zod schema to check if body of request is valid
  //returns error if it is not valid

  const validation = commentSchema.safeParse(body);
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

  //Finds user with the id given in the URL, and checks if user exists
  //returns error if it doesn't

  const user = await prisma.user.findUnique({
    where: {
      id: body.userId,
    },
  });

  if (!user)
    return NextResponse.json(
      { error: 'No user exits with that ID' },
      { status: 404 }
    );

  //creates a new comment for that video
  //returns the comment

  const res = await prisma.comment.create({
    data: {
      text: body.text,
      videoId: parseInt(id),
      userId: body.userId,
    },
  });

  return NextResponse.json(res, { status: 201 });
}
