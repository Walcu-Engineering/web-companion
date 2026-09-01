'use strict';
const debug = require('debug')('mapp:web-companion');

module.exports = async () => {
  const MAPI_URL = process.env.MAPP_API_BASE_URL;
  const MAPPEX_URL = process.env.MAPP_EXTERNALS_BASE_URL;
  const public_key = process.env.MAPP_WEB_COMPANION_PUBLIC_KEY;
  const private_key = process.env.MAPP_WEB_COMPANION_PRIVATE_KEY;

  if (!MAPI_URL) throw new Error('MAPP_API_BASE_URL environment variable is not defined');
  if (!MAPPEX_URL) throw new Error('MAPP_EXTERNALS_BASE_URL environment variable is not defined');
  if (!public_key) throw new Error('MAPP_WEB_COMPANION_PUBLIC_KEY environment variable is not defined');
  if (!private_key) throw new Error('MAPP_WEB_COMPANION_PRIVATE_KEY environment variable is not defined');

  const mfetch = require('@walcu-engineering/mapp-utils/mapp_auth_server_fetch_wrapper')('web_companion', public_key, private_key, [
    MAPI_URL,
    MAPPEX_URL,
  ].filter(f => f));
  return { mfetch, MAPI_URL, MAPPEX_URL, debug, public_key, private_key };
};
