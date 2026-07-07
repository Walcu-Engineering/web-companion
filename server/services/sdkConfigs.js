'use strict';

const getSdkConfig = async (mfetch, MAPI_URL, public_id) => {
  const params = new URLSearchParams({ q: JSON.stringify({ public_id }), limit: 1 });
  const res = await mfetch(`${MAPI_URL}sdkconfigs?${params.toString()}`);
  if (!res.ok) throw new Error(`Error fetching sdkconfig: ${res.status}`);
  const [config] = await res.json();
  return config || null;
};

module.exports = { getSdkConfig };
