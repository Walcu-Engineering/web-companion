'use strict';

const definitions_cache = new Map();
const DEFINITIONS_TTL_MS = 60 * 1000;

const getDefinitions = async (mfetch, MAPI_URL, dealer_id) => {
  const cached = definitions_cache.get(dealer_id);
  if (cached && cached.expires_at > Date.now()) return cached.data;
  try {
    const definitions = await mfetch(`${MAPI_URL}dealers/${dealer_id}/sdkeventdefinitions`)
      .then(res => res.ok ? res.json() : Promise.reject(new Error(`sdkeventdefinitions fetch failed: ${res.status}`)));
    definitions_cache.set(dealer_id, { data: definitions, expires_at: Date.now() + DEFINITIONS_TTL_MS });
    return definitions;
  } catch (err) {
    console.error(`[sdkEvents] Failed to fetch sdkeventdefinitions for dealer ${dealer_id}:`, err);
    return [];
  }
};

const matchDefinition = (event, definitions) => definitions.find(def =>
  def.selector === event.target?.selector &&
  (!def.page_url_prefix || (event.page_url || '').startsWith(def.page_url_prefix)));

const upsertSession = async (mfetch, MAPI_URL, dealer_id, { public_id, visitor_id, session_id, event_count_increment }) => {
  const now = new Date();
  const expires_at = new Date(now.getTime() + 30 * 60 * 1000);

  const createRes = await mfetch(`${MAPI_URL}dealers/${dealer_id}/sdksessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      public_id, visitor_id, session_id,
      started_at: now, last_activity_at: now, expires_at,
      event_count: event_count_increment,
    }),
  });
  if (createRes.ok) return;
  if (createRes.status !== 409) {
    throw new Error(`sdksessions create failed: ${createRes.status}`);
  }

  const [existing] = await mfetch(`${MAPI_URL}dealers/${dealer_id}/sdksessions?${new URLSearchParams({
    search: `session_id = ${session_id}`,
  })}`).then(res => res.ok ? res.json() : Promise.reject(new Error(`sdksessions lookup failed: ${res.status}`)));
  if (!existing) return;

  await mfetch(`${MAPI_URL}dealers/${dealer_id}/sdksessions/${existing._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([
      { op: 'replace', path: '/last_activity_at', value: now },
      { op: 'replace', path: '/expires_at', value: expires_at },
      { op: 'replace', path: '/event_count', value: (existing.event_count || 0) + event_count_increment },
    ]),
  }).then(res => res.ok ? res.json() : Promise.reject(new Error(`sdksessions patch failed: ${res.status}`)));
};

const createEvents = async (mfetch, MAPI_URL, dealer_id, { public_id, visitor_id, session_id, events }) => {
  if (session_id) {
    await upsertSession(mfetch, MAPI_URL, dealer_id, { public_id, visitor_id, session_id, event_count_increment: events.length });
  }
  const definitions = await getDefinitions(mfetch, MAPI_URL, dealer_id);
  return Promise.all(events.map(event => {
    const match = event.event_type === 'auto_click' ? matchDefinition(event, definitions) : null;
    return mfetch(`${MAPI_URL}dealers/${dealer_id}/sdkevents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_id, visitor_id, session_id, ...event,
        ...(match && { sdk_event_definition_id: match._id }),
      }),
    }).then(r => r.ok ? r.json() : Promise.reject(new Error(`sdkevents create failed: ${r.status}`)));
  }));
};

module.exports = { createEvents };
