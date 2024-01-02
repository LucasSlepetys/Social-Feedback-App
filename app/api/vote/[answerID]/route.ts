import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/AuthOptions';

//props to get id from request URL
export interface Props {
  params: {
    answerID: string;
  };
}

//increases vote of an answer by one
export async function PATCH(
  request: NextRequest,
  { params: { answerID } }: Props
) {
  //validate if the user is authenticated:
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: 'User must be logged in to do this request' },
      { status: 401 }
    );

  const answer = await prisma.answer.findUnique({
    where: {
      id: answerID,
    },
  });

  if (!answer)
    return NextResponse.json(
      { error: 'Answer does not exist with that id' },
      { status: 404 }
    );

  const res = await prisma.answer.update({
    where: {
      id: answerID,
    },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(res, { status: 200 });
}
