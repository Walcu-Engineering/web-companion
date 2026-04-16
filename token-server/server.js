import 'dotenv/config'
import express from 'express'
import { MongoClient } from 'mongodb'
import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant
import { randomUUID } from 'crypto'
import jwt from 'jsonwebtoken'


const app = express()
const PORT = process.env.PORT || 4000

const mongoCLient = new MongoClient(
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`
)
let db
mongoCLient.connect().then(() => {
  db = mongoCLient.db(process.env.MONGO_DB)
})

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
    res.setHeader('Vary', 'Origin')
  }

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
  if (!client || !client.allowedDomains.inclued(hostname)) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  const accessToken = jwt.sign({
    clientId,
    domain: hostname,
    scope: 'call-access',
  },
    process.env.PRIVATE_KEY,
    {
      expiresIn: '10m'
    }
  )
  res.json({ accessToken })
})

app.get('/token', verifyAccessToken, (_req, res) => {

  // build the base JWT signed with our API KEY + SECRET
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {
      identity: `anon-${randomUUID()}`,
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

app.listen(PORT, () => {
  console.log(`token-server escuchando en http://localhost:${PORT}`)
})
