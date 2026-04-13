require('dotenv').config()
import express from 'express'
import AccessToken from 'twilio/lib/jwt/AccessToken'
const twilio = require('twilio')
const app = express()
const PORT = process.env.PORT || 4000

// Allow requests by CORS
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/token', (_req, res) => {
  const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  // create identity on server?
  const token = new AccessToken(
    ACCOUNT_SID
  )
})

app.listen(PORT, () => {
  console.log(`token-server escuchando en http://localhost:${PORT}`)
})
