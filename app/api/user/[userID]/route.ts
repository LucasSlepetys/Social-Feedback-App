import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

interface Props {
  params: {
    userID: string;
  };
}

//delete User //all other relations are deleting due to onDelete prisma
export async function DELETE(
  request: NextRequest,
  { params: { userID } }: Props
) {
  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userID),
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found with given id' },
      { status: 404 }
    );
  }

  // Perform the deletion of the User along with its related entities (since cascading delete is set)
  await prisma.user.delete({
    where: {
      id: parseInt(userID),
    },
  });

  return NextResponse.json(
    { message: 'User deleted successfully' },
    { status: 200 }
  );
}
