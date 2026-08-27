'use strict';
const express              = require('express');
const { getSdkConfig }     = require('../services/sdkConfigs');
const { validateDomain }   = require('../services/domains');
const { createEventIntent, createEventBatch } = require('../services/calls');
const { sendGenericError } = require('../lib/errors');

module.exports = ({ mfetch, MAPI_URL, MAPPEX_URL, debug }) => {
  const router = express.Router();

  router.get('/config', async (req, res) => {
    const { public_id } = req.query;
    if (!public_id) return sendGenericError(res, 400);

    let config;
    try {
      config = await getSdkConfig(mfetch, MAPI_URL, public_id);
    } catch (err) {
      debug('Error fetching sdkconfig: %o', err);
      return sendGenericError(res, 500);
    }

    if (!config) return sendGenericError(res, 404);
    if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) return sendGenericError(res, 403);

    return res.json({ ok: true, button: { label: 'Llamar' } });
  });

  router.get('/voice-token', async (req, res) => {
    const { public_id } = req.query;
    if (!public_id) return sendGenericError(res, 400);

    let config;
    try {
      config = await getSdkConfig(mfetch, MAPI_URL, public_id);
    } catch (err) {
      debug('Error fetching sdkconfig: %o', err);
      return sendGenericError(res, 500);
    }

    if (!config) return sendGenericError(res, 404);
    if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) return sendGenericError(res, 403);

    try {
      const tokenRes = await mfetch(`${MAPPEX_URL}services/twilio/dealers/${config.dealer_id}/voice/companion_token?public_id=${encodeURIComponent(public_id)}`);
      if (!tokenRes.ok) return sendGenericError(res, 500);
      const token = await tokenRes.text();
      return res.json({ ok: true, token });
    } catch (err) {
      debug('Error fetching companion token: %o', err);
      return sendGenericError(res, 500);
    }
  });

  router.post('/events', async (req, res) => {
    const { public_id } = req.body;
    if (!public_id) return sendGenericError(res, 400);

    let config;
    try {
      config = await getSdkConfig(mfetch, MAPI_URL, public_id);
    } catch (err) {
      debug('Error fetching sdkconfig: %o', err);
      return sendGenericError(res, 500);
    }

    if (!config) return sendGenericError(res, 404);
    if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) return sendGenericError(res, 403);

    try {
      const { call_intent_id } = await createEventIntent(mfetch, MAPPEX_URL, config.dealer_id, req.body);
      return res.json({ ok: true, call_intent_id });
    } catch (err) {
      debug('Error creating call intent: %o', err);
      return sendGenericError(res, 500);
    }
  });

  router.options('/events/batch', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(204);
  });

  router.post('/events/batch', async (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');

    const { public_id, events } = req.body;
    if (!public_id || !Array.isArray(events) || !events.length || events.length > 50) return sendGenericError(res, 400);

    let config;
    try {
      config = await getSdkConfig(mfetch, MAPI_URL, public_id);
    } catch (err) {
      debug('Error fetching sdkconfig: %o', err);
      return sendGenericError(res, 500);
    }

    if (!config) return sendGenericError(res, 404);
    if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) return sendGenericError(res, 403);

    try {
      await createEventBatch(mfetch, MAPPEX_URL, config.dealer_id, req.body);
      return res.json({ ok: true });
    } catch (err) {
      debug('Error creating event batch: %o', err);
      return sendGenericError(res, 500);
    }
  });

  return router;
};
