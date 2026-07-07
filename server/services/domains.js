'use strict';

const getDomainFromRequest = (req) => {
  const origin  = req.headers['origin'];
  const referer = req.headers['referer'];

  if (origin) {
    try { return new URL(origin).hostname; } catch (_) { /* ignore */ }
  }
  if (referer) {
    try { return new URL(referer).hostname; } catch (_) { /* ignore */ }
  }
  return null;
};

const validateDomain = (req, allowed_domains) => {
  const hostname = getDomainFromRequest(req);
  if (!hostname) return false;
  return allowed_domains.includes(hostname);
};

module.exports = { validateDomain };
