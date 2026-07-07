'use strict';

const sendGenericError = (res, status = 500) =>
  res.status(status).json({ ok: false, error: 'Invalid configuration' });

module.exports = { sendGenericError };
