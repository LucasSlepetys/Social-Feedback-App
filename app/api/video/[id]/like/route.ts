import { NextRequest, NextResponse } from 'next/server';
import { Props } from '../Props';
import prisma from '@/prisma/client';

//increase the like by one in the video
export async function PATCH(request: NextRequest, { params: { id } }: Props) {
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

  //increases the likes on the video by one
  //returns updated video
  const res = await prisma.video.update({
    where: { id: parseInt(id) },
    data: {
      numberOfLikes: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(res, { status: 200 });
}
