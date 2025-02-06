// lib/game-service.ts
import { redis } from './redis'

export const gameService = {
  async createGame() {
    const sessionId = crypto.randomUUID()
    const numbers = new Set<number>()
    while (numbers.size < 3) {
      numbers.add(Math.floor(Math.random() * 91))
    }
    const targets = Array.from(numbers)
    
    // Store in Redis with 1-hour expiry
    await redis.set(`game:${sessionId}`, JSON.stringify({
      targets,
      startTime: Date.now(),
      attempts: []
    }), { ex: 3600 })
    
    return { sessionId, targets }
  },

  async getGame(sessionId: string) {
    return redis.get<{
      targets: number[]
      startTime: number
      attempts: number[]
    }>(`game:${sessionId}`)
  },

  async addAttempt(sessionId: string, value: number) {
    const game = await this.getGame(sessionId)
    if (!game) throw new Error('Game not found')
    
    game.attempts.push(value)
    await redis.set(`game:${sessionId}`, JSON.stringify(game), { ex: 3600 })
    
    return game
  },

  async completeGame(sessionId: string, timeElapsed: number, playerName: string) {
    const game = await this.getGame(sessionId)
    if (!game) return
    
  }
}