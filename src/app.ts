import express from 'express'
import * as middleware from './middleware'
import env from './config/env'
import newUserSchema from './validation/newUser'
import {
  checkUserExists,
  createNewUserDatabaseEntry
} from './controller/notion'
import capitalize from './lib/capitalize'
import cors from 'cors'

// create a simple express server

console.log('Starting in ' + env.nodeEnv + ' mode')

const app = express()

// express-rate-limit not working on heroku
// See: https://stackoverflow.com/a/62494604/4179020
app.set('trust proxy', 1);

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send({
    message:
      'Hi, my name is HSDio 🤖! I am the API Endpoint for the Notion-HSD-Project.',
    help: {
      message: 'You want me to learn more skills visit my where I live at:',
      whereILive: 'https://github.com/KuhlTime/hsd-notion-api'
    }
  })
})

app.post(
  '/user',
  middleware.rateLimiter,
  middleware.validation(newUserSchema),
  async (req, res) => {
    const email: string = req.body.email
    const invitedBy: string = req.body.invitedBy

    // validate email is from the right domain
    const emailSplit = email.split('@')
    if (emailSplit[emailSplit.length - 1] !== 'study.hs-duesseldorf.de') {
      res.status(400).send({
        success: false,
        message:
          'The email address is not a valid study.hs-duesseldorf.de email address.'
      })
      return
    }

    // check if user already exists
    const exists = await checkUserExists(email)

    if (exists) {
      res.status(200).send({
        success: true,
        message: 'The email address is already registered.'
      })

      return
    }

    // has its limitations but works for now (for example if persons have double names)
    const nameSplit = emailSplit[0].split('.')
    const generatedName =
      capitalize(nameSplit[0]) + ' ' + capitalize(nameSplit[1])
    createNewUserDatabaseEntry(generatedName, email, invitedBy)

    res.send({
      success: true,
      message: `Requested access for user with ${email} - generated name: ${generatedName}`
    })
  }
)

// get the PORT environment variable
app.listen(env.port, () => {
  console.log(`server started at http://localhost:${env.port}`)
})
