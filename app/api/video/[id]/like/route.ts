import { NextRequest, NextResponse } from 'next/server';
import { Props } from '../Props';
import prisma from '@/prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/AuthOptions';
import { getServerSession } from 'next-auth';

//increase the like by one in the video
export async function PATCH(request: NextRequest, { params: { id } }: Props) {
  //validate if the user is authenticated:
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session)
    return NextResponse.json(
      { error: 'User must be logged in to do this request' },
      { status: 401 }
    );

  //Finds video with the id given in the URL, and checks if video exists
  //returns error if it doesn't
  const video = await prisma.video.findUnique({
    where: {
      id: id,
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
    where: { id: id },
    data: {
      numberOfLikes: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(res, { status: 200 });
}
