import dotenv from 'dotenv'
import Joi from 'joi'

dotenv.config()

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  NOTION_API_KEY: Joi.string().required()
}).unknown()

const { error, value: envVars } = envSchema.validate(process.env)

if (error) {
  console.error(
    `Config validation error (Check ENV Variables): ${error.message}`
  )
  process.exit(1)
}

export default {
  nodeEnv: envVars.NODE_ENV,
  port: envVars.PORT,
  notionApiKey: envVars.NOTION_API_KEY
}
