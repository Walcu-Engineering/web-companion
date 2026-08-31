'use strict';
const express              = require('express');
const { getSdkConfig }     = require('../services/sdkConfigs');
const { validateDomain }   = require('../services/domains');
const { createEventIntent, createEventBatch, validatePickerToken } = require('../services/calls');
const { sendGenericError } = require('../lib/errors');

module.exports = ({ mfetch, MAPI_URL, MAPPEX_URL, debug }) => {
  const router = express.Router();
  const resolveConfig = async (req, public_id) => {
    if (!public_id) throw Object.assign(new Error('missing public_id'), { status: 400 });

    let config;
    try {
      config = await getSdkConfig(mfetch, MAPI_URL, public_id);
    } catch (err) {
      debug('Error fetching sdkconfig: %o', err);
      throw Object.assign(new Error('sdkconfig fetch failed'), { status: 500 });
    }

    if (!config) throw Object.assign(new Error('sdkconfig not found'), { status: 404 });
    if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) {
      throw Object.assign(new Error('sdkconfig inactive or domain not allowed'), { status: 403 });
    }
    return config;
  };

  router.get('/config', async (req, res) => {
    try {
      await resolveConfig(req, req.query.public_id);
      return res.json({ ok: true, button: { label: 'Llamar' } });
    } catch (err) {
      return sendGenericError(res, err.status || 500);
    }
  });

  router.get('/voice-token', async (req, res) => {
    const { public_id } = req.query;
    try {
      const config = await resolveConfig(req, public_id);
      const tokenRes = await mfetch(`${MAPPEX_URL}services/twilio/dealers/${config.dealer_id}/voice/companion_token?public_id=${encodeURIComponent(public_id)}`);
      if (!tokenRes.ok) return sendGenericError(res, 500);
      const token = await tokenRes.text();
      return res.json({ ok: true, token });
    } catch (err) {
      if (!err.status) debug('Error fetching companion token: %o', err);
      return sendGenericError(res, err.status || 500);
    }
  });

  router.post('/events', async (req, res) => {
    try {
      const config = await resolveConfig(req, req.body.public_id);
      const { call_intent_id } = await createEventIntent(mfetch, MAPPEX_URL, config.dealer_id, req.body);
      return res.json({ ok: true, call_intent_id });
    } catch (err) {
      if (!err.status) debug('Error creating call intent: %o', err);
      return sendGenericError(res, err.status || 500);
    }
  });

  const applyCors = (req, res) => {
    if (!req.headers.origin) return;
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  };

  router.options('/picker/validate', (req, res) => {
    applyCors(req, res);
    res.sendStatus(204);
  });

  router.post('/picker/validate', async (req, res) => {
    applyCors(req, res);
    const { public_id, token } = req.body;
    if (!token) return sendGenericError(res, 400);
    try {
      const config = await resolveConfig(req, public_id);
      const result = await validatePickerToken(mfetch, MAPPEX_URL, config.dealer_id, token);
      return res.json(result);
    } catch (err) {
      if (!err.status) debug('Error validating picker token: %o', err);
      return sendGenericError(res, err.status || 500);
    }
  });

  router.options('/events/batch', (req, res) => {
    applyCors(req, res);
    res.sendStatus(204);
  });

  router.post('/events/batch', async (req, res) => {
    applyCors(req, res);
    const { public_id, events } = req.body;
    if (!Array.isArray(events) || !events.length || events.length > 50) return sendGenericError(res, 400);

    try {
      const config = await resolveConfig(req, public_id);
      await createEventBatch(mfetch, MAPPEX_URL, config.dealer_id, req.body);
      return res.json({ ok: true });
    } catch (err) {
      if (!err.status) debug('Error creating event batch: %o', err);
      return sendGenericError(res, err.status || 500);
    }
  });

  return router;
};
