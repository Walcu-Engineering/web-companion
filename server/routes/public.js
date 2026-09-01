'use strict';
const express                = require('express');
const { fetchConfigOrThrow } = require('../services/sdkConfigs');
const { verifyEmbedToken }   = require('../services/embedToken');
const { sendGenericError }   = require('../lib/errors');

module.exports = ({ mfetch, MAPI_URL, MAPPEX_URL, debug, public_key }) => {
  const router = express.Router();

  const resolveActiveConfig = async (public_id, token) => {
    const claims = verifyEmbedToken(public_key, token);
    if (!claims || claims.public_id !== public_id) throw Object.assign(new Error('invalid embed token'), { status: 403 });

    const config = await fetchConfigOrThrow(mfetch, MAPI_URL, debug, public_id);
    if (!config || config.status !== 'active') throw Object.assign(new Error('sdkconfig missing or inactive'), { status: 403 });
    return config;
  };

  router.get('/config', async (req, res) => {
    const { public_id, token } = req.query;
    if (!public_id || !token) return sendGenericError(res, 400);

    try {
      await resolveActiveConfig(public_id, token);
    } catch (err) {
      return sendGenericError(res, err.status || 500);
    }
    return res.json({ ok: true, button: { label: 'Llamar' } });
  });

  router.get('/voice-token', async (req, res) => {
    const { public_id, token } = req.query;
    if (!public_id || !token) return sendGenericError(res, 400);

    try {
      const config = await resolveActiveConfig(public_id, token);
      const tokenRes = await mfetch(`${MAPPEX_URL}services/twilio/dealers/${config.dealer_id}/voice/companion_token?public_id=${encodeURIComponent(public_id)}`);
      if (!tokenRes.ok) return sendGenericError(res, 500);
      const voiceToken = await tokenRes.text();
      return res.json({ ok: true, token: voiceToken });
    } catch (err) {
      if (!err.status) debug('Error fetching companion token: %o', err);
      return sendGenericError(res, err.status || 500);
    }
  });

  return router;
};
