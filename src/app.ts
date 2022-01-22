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

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send({
    message:
      'Hi, my name is HSDio 🤖! I am the API Endpoint for the Notion-HSD-Project.',
    help: {
      message:
        'I may need some more features. You can find more information about me at my owners github page.',
      github: 'https://github.com/KuhlTime'
    }
  })
})

app.post(
  '/user',
  middleware.rateLimiter,
  middleware.validation(newUserSchema),
  async (req, res) => {
    const email: string = req.body.email

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
    createNewUserDatabaseEntry(generatedName, email)

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
