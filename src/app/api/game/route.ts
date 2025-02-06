// app/api/game/route.ts
import { gameService } from '@/lib/game-service'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const game = await gameService.createGame()
    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}

// Leaderboard retrieval
export async function GET() {
  try {
    const leaderboard = await redis.zrange('leaderboard', 0, 9, {
      withScores: true,
      rev: true
    })

    const entries = leaderboard
      .filter(entry => typeof entry === 'string')
      .map(entry => JSON.parse(entry as string))

    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

// Leaderboard submission
export async function PATCH(request: Request) {
  try {
    const { name, sessionId, time } = await request.json();
    
    if (!name || !sessionId || !time) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const result = await redis.zadd('leaderboard', {
      score: time,
      member: JSON.stringify({
        name,
        time,
        completedAt: Date.now()
      })
    });

    if (!result) {
      throw new Error('Failed to add to leaderboard');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to leaderboard:', error);
    return NextResponse.json({ error: 'Failed to add to leaderboard' }, { status: 500 });
  }
}