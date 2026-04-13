import 'dotenv/config'
import express from 'express'

import twilio from 'twilio'

const AccessToken = twilio.jwt.AccessToken
const VoiceGrant = AccessToken.VoiceGrant
import { randomUUID } from 'crypto'


const app = express()
const PORT = process.env.PORT || 4000

// Allow cross-origin requests from the SDK injected in the frontend
// TODO: filter by CORS (restrict origin to some domain)
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/token', (_req, res) => {

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
