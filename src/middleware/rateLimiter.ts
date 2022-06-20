import rateLimit from 'express-rate-limit'
import env from '../config/env'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
})

export default limiter
