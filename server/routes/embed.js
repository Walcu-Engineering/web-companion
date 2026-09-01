'use strict';
const path                    = require('path');
const express                 = require('express');
const { resolveDealerConfig } = require('../services/sdkConfigs');
const { mintEmbedToken }      = require('../services/embedToken');
const { sendGenericError }    = require('../lib/errors');

module.exports = ({ mfetch, MAPI_URL, private_key, debug }) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    const { public_id, token } = req.query;
    if (!public_id) return res.status(400).json({ ok: false, error: 'Missing public_id' });

    if (token) {
      debug('Serving embed iframe for public_id=%s', public_id);
      return res.sendFile(path.join(__dirname, '../../client/iframe/index.html'));
    }

    try {
      await resolveDealerConfig(mfetch, MAPI_URL, debug, req, public_id);
    } catch (err) {
      return sendGenericError(res, err.status || 500);
    }

    const params = new URLSearchParams(req.query);
    params.set('token', mintEmbedToken(private_key, public_id));
    return res.redirect(302, `/embed?${params.toString()}`);
  });

  return router;
};
