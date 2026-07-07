'use strict';
const path    = require('path');
const express = require('express');

module.exports = ({ debug }) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    const { public_id } = req.query;
    if (!public_id) return res.status(400).json({ ok: false, error: 'Missing public_id' });
    debug('Serving embed iframe for public_id=%s', public_id);
    res.sendFile(path.join(__dirname, '../../client/iframe/index.html'));
  });

  return router;
};
