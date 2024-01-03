import prisma from '@/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/AuthOptions';

interface Props {
  params: {
    userID: string;
  };
}

//delete User //all other relations are deleted due to onDelete prisma
//** Check that the user being deleted is the same user that is logged in */
export async function DELETE(
  request: NextRequest,
  { params: { userID } }: Props
) {
  //validate if the user is authenticated:
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json(
      { error: 'User must be logged in to do this request' },
      { status: 401 }
    );

  //checks if user exists before deleting it

  const user = await prisma.user.findUnique({
    where: {
      id: userID,
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
      id: userID,
    },
  });

  return NextResponse.json(
    { message: 'User deleted successfully' },
    { status: 200 }
  );
}
