import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/prisma/client';

//Zod schema used to validate body of create new video request
const videoSchema = z.object({
  createdById: z.number(),
  link: z.string().min(5, 'Please add a valid link'),
});

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
