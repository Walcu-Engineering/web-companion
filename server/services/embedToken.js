'use strict';
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mintEmbedToken = (private_key, public_id) => jwt.sign(
  { public_id },
  crypto.createPrivateKey(private_key),
  { algorithm: 'RS512', expiresIn: '1h', subject: 'WEB_COMPANION_EMBED_TOKEN' },
);

const verifyEmbedToken = (public_key, token) => {
  try {
    return jwt.verify(token, crypto.createPublicKey(public_key), { algorithms: ['RS512'], subject: 'WEB_COMPANION_EMBED_TOKEN' });
  } catch (_) {
    return null;
  }
};

module.exports = { mintEmbedToken, verifyEmbedToken };
