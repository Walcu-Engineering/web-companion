import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// token helpers
const TOKEN_CONFIG = {
  access: { scope: 'call-access', expiresIn: '10m' },
  refresh: { scope: 'refresh', expiresIn: '7d' }
}

const app = express()
const PORT = process.env.PORT || 4000

const mongoCLient = new MongoClient(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@127.0.0.1:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authSource=admin`
)
let db
mongoCLient.connect().then(() => {
  db = mongoCLient.db(process.env.MONGO_DB)
})

app.use(express.json())

app.use(async (req, res, next) => {
  const origin = req.headers.origin
  if (!origin) return next()

  let hostname
  try {
    hostname = new URL(origin).hostname
  } catch {
    return next()
  }

  const client = await db.collection('users').findOne({ allowedDomains: hostname, active: true })

  if (client) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Vary', 'Origin')
  }

  if (req.method === 'OPTIONS') return res.status(204).end()

  next()
})

function verifyAccessToken(req, res, next) {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null

  if (!token) return res.status(401).json({ error: 'Missing access token' })

  try {
    req.auth = jwt.verify(token, process.env.PRIVATE_KEY)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' })
  }
}

function signToken(type, { clientId, domain }) {
  const { scope, expiresIn } = TOKEN_CONFIG[type]
  return jwt.sign(
    { clientId, domain, scope },
    process.env.PRIVATE_KEY,
    { expiresIn }
  )
}

function issueTokenPair(payload) {
  return {
    accessToken: signToken('access', payload),
    refreshToken: signToken('refresh', payload)
  }
}


app.post('/auth', async (req, res) => {
  const { clientId } = req.body
  const origin = req.headers.origin || req.headers.referer || ''

  let hostname
  try {
    hostname = new URL(origin).hostname
  } catch {
    return res.status(400).json({ error: 'Bad request' })
  }

  const client = await db.collection('users').findOne({ _id: clientId, active: true })
  if (!client || !client.allowedDomains.includes(hostname)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  res.json(issueTokenPair({ clientId, domain: hostname }))

})

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body
  if (!refreshToken) return res.status(401).json({ error: 'Missing refreshToken' })

  try {
    const payload = jwt.verify(refreshToken, process.env.PRIVATE_KEY)

    if (payload.scope !== 'refresh') return res.status(401).json({ error: 'Invalid token scope' })

    const accessToken = signToken('access', {
      clientId: payload.clientId,
      domain: payload.domain,
    })

    res.json({ accessToken })
  } catch {
    res.status(401).json({ error: 'Invalid or expired refreshToken' })
  }
})

app.get('/token', verifyAccessToken, (req, res) => {
  const visitorId = req.query.visitorId || randomUUID()

  // build the base JWT signed with API KEY + SECRET
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {
      identity: `${req.auth.clientId}__${visitorId}`,
      ttl: 3600
    }
  )

  // grant outgoing call permissions via TwiML App
  // incomingAllow: false - SDK does not recieve calls
  const grant = new VoiceGrant({
    outgoingApplicationSid:
      process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: false
  })

  token.addGrant(grant)

  // return the serialized JWT to the SDK
  res.json({ token: token.toJwt() })

})

app.get('/widget/:clientId/CallWidget.js', async (req, res) => {
  const { clientId } = req.params

  const client = await db.collection('users').findOne({ _id: clientId, active: true })
  if (!client) return res.status(403).end()

  const sdk = readFileSync(join(__dirname, '../packages/sdk-call/CallWidget.js'), 'utf8')
  res.setHeader('Cache-Control', 'public, max-age=300')
  res.type('application/javascript')
  res.send(`window.__CALL_WIDGET_CLIENT_ID__ = '${clientId}';\n${sdk}`)
})

app.listen(PORT, () => {
  console.log(`token-server escuchando en http://localhost:${PORT}`)
})
