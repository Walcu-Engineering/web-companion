import 'dotenv/config';
import express from 'express';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const VoiceResponse = twilio.twiml.VoiceResponse;

const app = express();
const PORT = process.env.PORT || 3002;

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/token', (_req, res) => {
  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {
      // for the momento only one agent handle all the calls
      identity: 'agent',
      ttl: 3600
    }
  );

  const grant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: true
  });

  token.addGrant(grant);

  res.json({ token: token.toJwt() });
});

app.post('/twiml/voice', (_req, res) => {
  // route to handle, when a client call, Twilio redirect to this route
  // we just tell Twilio to call agent (previously created on token)
  const response = new VoiceResponse();
  const dial = response.dial();
  dial.client('agent');

  res.type('text/xml');
  res.send(response.toString());
});

app.listen(PORT, () => {
  console.log(`agent-server escuchando en http://localhost:${PORT}`);
});
