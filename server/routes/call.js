'use strict';
const path    = require('path');
const express = require('express');

module.exports = ({ debug }) => {
  const router = express.Router();

  router.get('/', (_, res) => {
    debug('Serving call application shell');
    res.sendFile(path.join(__dirname, '../../client/call/index.html'));
  });

  return router;
};
