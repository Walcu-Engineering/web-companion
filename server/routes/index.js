'use strict';
const express = require('express');

module.exports = ({ mfetch, MAPI_URL, MAPPEX_URL, debug }) => {
  const router = express.Router();

  router.get('/health', (_, res) => res.json({ ok: true }));
  router.use('/embed', require('./embed.js')({ debug }));
  router.use('/public', require('./public.js')({ mfetch, MAPI_URL, MAPPEX_URL, debug }));

  return router;
};
