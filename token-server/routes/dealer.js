import { Router } from 'express';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

import twilio from 'twilio';

import { validateDealer } from '../middleware/dealer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { AccessToken } = twilio.jwt;
const { VoiceGrant } = AccessToken;

const router = Router({ mergeParams: true });

router.get('/token', validateDealer, (req, res) => {
  const visitorId = req.query.visitorId || randomUUID();

  const token = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    {
      identity: `${req.dealer._id}__${visitorId}`,
      ttl: 3600
    }
  );

  const grant = new VoiceGrant({
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    incomingAllow: false
  });

  token.addGrant(grant);
  res.json({ token: token.toJwt() });
});

router.get('/widget/CallWidget.js', (req, res) => {
  const sdk = readFileSync(join(__dirname, '../../packages/sdk-call/CallWidget.js'), 'utf8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.type('application/javascript');
  res.send(`window.__CALL_WIDGET_CLIENT_ID__ = '${req.params.dealerId}';\n${sdk}`);
});

export default router;
