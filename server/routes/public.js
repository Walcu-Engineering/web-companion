'use strict';
const express              = require('express');
const { getSdkConfig }     = require('../services/sdkConfigs');
const { validateDomain }   = require('../services/domains');
const { sendGenericError } = require('../lib/errors');

module.exports = ({ mfetch, MAPI_URL, debug }) => {
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

  return router;
};
