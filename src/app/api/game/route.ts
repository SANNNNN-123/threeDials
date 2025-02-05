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

export async function PUT(request: Request) {
  try {
    const { sessionId, value, timeElapsed, playerName } = await request.json()
    const game = await gameService.addAttempt(sessionId, value)
    
    if (timeElapsed && playerName) {
      await gameService.completeGame(sessionId, timeElapsed, playerName)
    }
    
    return NextResponse.json(game)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update game' }, { status: 500 })
  }
}

// Add leaderboard endpoints
export async function GET() {
  try {
    const leaderboard = await redis.zrange('leaderboard', 0, 9, {
      withScores: true,
      rev: true // Change to true to get lowest times first
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

// Add leaderboard submission endpoint
export async function PATCH(request: Request) {
  try {
    const { name, sessionId, time } = await request.json()
    
    if (!name || !sessionId) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    // Store with time as score (lower is better)
    await redis.zadd('leaderboard', {
      score: time, // Lower times will be ranked higher
      member: JSON.stringify({
        name,
        time,
        country: 'Unknown', // Add default country
        completedAt: Date.now()
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error adding to leaderboard:', error)
    return NextResponse.json({ error: 'Failed to add to leaderboard' }, { status: 500 })
  }
}