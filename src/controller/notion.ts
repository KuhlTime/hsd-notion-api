import env from '../config/env'
import axios from 'axios'

async function checkUserExists(email: string): Promise<boolean> {
  const res = await axios({
    method: 'POST',
    url: 'https://api.notion.com/v1/databases/9bc896f456a541efbe3917a1a51999f7/query',
    headers: {
      Authorization: `Bearer ${env.notionApiKey}`,
      'Notion-Version': '2021-08-16',
      'Content-Type': 'application/json'
    },
    data: {
      filter: {
        or: [
          {
            rich_text: {
              contains: email
            },
            property: 'E-Mail'
          }
        ]
      }
    }
  })

  return res.data.results.length > 0
}

async function createNewUserDatabaseEntry(
  name: string,
  email: string,
  invitedBy: string
): Promise<boolean> {
  const res = await axios({
    method: 'POST',
    url: 'https://api.notion.com/v1/pages',
    headers: {
      Authorization: `Bearer ${env.notionApiKey}`,
      'Notion-Version': '2021-08-16',
      'Content-Type': 'application/json'
    },
    data: {
      properties: {
        Rolle: {
          select: {
            name: 'Aufnahme Anfrage'
          }
        },
        Name: {
          title: [
            {
              text: {
                content: name
              }
            }
          ]
        },
        'E-Mail': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: email,
                link: {
                  url: `mailto:${email}`
                }
              }
            }
          ]
        }
      },
      icon: {
        emoji: '👋'
      },
      children: [
        {
          type: 'paragraph',
          object: 'block',
          paragraph: {
            text: [
              {
                type: 'text',
                text: {
                  content: `Online Anfrage: ${new Date().toLocaleString(
                    'de'
                  )} - Eingeladen von: ${invitedBy}`
                }
              }
            ]
          }
        }
      ],
      parent: {
        database_id: '9bc896f456a541efbe3917a1a51999f7'
      }
    }
  })

  if (res.status !== 200) {
    console.error(`Error creating new user database entry for user ${email}`)
    return false
  } else {
    return true
  }
}

export { createNewUserDatabaseEntry, checkUserExists }
