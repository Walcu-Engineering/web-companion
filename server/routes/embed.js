'use strict';
const path    = require('path');
const express = require('express');

module.exports = ({ debug }) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { public_id, token } = req.query;
    if (!public_id || !token) return res.status(400).json({ ok: false, error: 'Missing public_id or token' });
    debug('Serving embed iframe for public_id=%s', public_id);
    res.sendFile(path.join(__dirname, '../../client/iframe/index.html'));
  });

  return router;
};
