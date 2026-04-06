import { NextResponse } from 'next/server';
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID шаардлагатай' }, { status: 400 });
    }

    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { score: true }
    });

    const userStars = user?.score || 0;

  
    let allowedHeroesCount = 5; 

    if (userStars >= 300) {
      allowedHeroesCount = 20; 
    } else if (userStars >= 150) {
      allowedHeroesCount = 15; 
    } else if (userStars >= 50) {
      allowedHeroesCount = 10; 
    }

   
    const allHeroes = await prisma.hero.findMany({
      orderBy: { id: 'asc' }
    });

    const heroesWithStatus = allHeroes.map((hero, index) => ({
      ...hero,
      isLocked: index >= allowedHeroesCount 
    }));

    return NextResponse.json({
      userStars,
      heroes: heroesWithStatus
    });

  } catch (error) {
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}