import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

//props to get id from request URL
export interface Props {
  params: {
    answerID: string;
  };
}

export async function PATCH(
  request: NextRequest,
  { params: { answerID } }: Props
) {
  const answer = await prisma.answer.findUnique({
    where: {
      id: parseInt(answerID),
    },
  });

  if (!answer)
    return NextResponse.json(
      { error: 'Answer does not exist with that id' },
      { status: 404 }
    );

  const res = await prisma.answer.update({
    where: {
      id: parseInt(answerID),
    },
    data: {
      votes: {
        increment: 1,
      },
    },
  });

  return NextResponse.json(res, { status: 200 });
}
