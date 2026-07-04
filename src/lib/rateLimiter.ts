import { RateLimiterMemory } from "rate-limiter-flexible"

export const loginRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
})

export const registerRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60,
})