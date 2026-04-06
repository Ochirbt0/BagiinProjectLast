import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, starsToAdd } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        score: { increment: starsToAdd }
      },
      select: { id: true, score: true } 
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Оноо шинэчлэхэд алдаа гарлаа' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) return NextResponse.json({ error: 'User ID missing' }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { score: true }
  });

  return NextResponse.json(user);
}