'use strict';
const { validateDomain } = require('./domains');

const getSdkConfig = async (mfetch, MAPI_URL, public_id) => {
  const params = new URLSearchParams({ q: JSON.stringify({ public_id }), limit: 1 });
  const res = await mfetch(`${MAPI_URL}sdkconfigs?${params.toString()}`);
  if (!res.ok) throw new Error(`Error fetching sdkconfig: ${res.status}`);
  const [config] = await res.json();
  return config || null;
};

const fetchConfigOrThrow = async (mfetch, MAPI_URL, debug, public_id) => {
  try {
    return await getSdkConfig(mfetch, MAPI_URL, public_id);
  } catch (err) {
    debug('Error fetching sdkconfig: %o', err);
    throw Object.assign(new Error('sdkconfig fetch failed'), { status: 500 });
  }
};

const resolveDealerConfig = async (mfetch, MAPI_URL, debug, req, public_id) => {
  if (!public_id) throw Object.assign(new Error('missing public_id'), { status: 400 });

  const config = await fetchConfigOrThrow(mfetch, MAPI_URL, debug, public_id);
  if (!config) throw Object.assign(new Error('sdkconfig not found'), { status: 404 });
  if (config.status !== 'active' || !validateDomain(req, config.allowed_domains)) {
    throw Object.assign(new Error('sdkconfig inactive or domain not allowed'), { status: 403 });
  }
  return config;
};

module.exports = { getSdkConfig, fetchConfigOrThrow, resolveDealerConfig };
