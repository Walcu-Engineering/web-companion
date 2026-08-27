'use strict';

const createEventIntent = async (mfetch, MAPPEX_URL, dealer_id, payload) => {
  const res = await mfetch(`${MAPPEX_URL}services/twilio/dealers/${dealer_id}/voice/companion_events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error creating call intent: ${res.status}`);
  return res.json();
};

const createEventBatch = async (mfetch, MAPPEX_URL, dealer_id, payload) => {
  const res = await mfetch(`${MAPPEX_URL}services/sdk_events/dealers/${dealer_id}/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Error creating event batch: ${res.status}`);
  return res.json();
};

module.exports = { createEventIntent, createEventBatch };
