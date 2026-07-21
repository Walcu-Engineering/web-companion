'use strict';

(function () {
  const public_id = new URLSearchParams(window.location.search).get('public_id');
  if (!public_id) return;

  const STATES = {
    IDLE: 'idle',
    READY: 'ready',
    CONNECTING: 'connecting',
    IN_CALL: 'in_call',
    ERROR: 'error',
  };

  const ICONS = {
    call: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>',
    hangup: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.996.996 0 0 1-.29-.7c0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .27-.11.52-.29.7l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.1-.7-.28-.79-.73-1.68-1.36-2.66-1.85a.99.99 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/></svg>',
  };

  let device = null;
  let currentCall = null;
  let button = null;
  let state = STATES.IDLE;

  function setState(next) {
    state = next;
    if (!button) return;
    button.dataset.state = state;
    button.disabled = state === STATES.CONNECTING;
    button.innerHTML = state === STATES.IN_CALL ? ICONS.hangup : ICONS.call;
  }

  async function fetchVoiceToken() {
    const res = await fetch(`/public/voice-token?public_id=${encodeURIComponent(public_id)}`);
    const data = await res.json();
    if (!data.ok) throw new Error('voice-token error');
    return data.token;
  }

  async function ensureDevice() {
    if (device) return device;
    const token = await fetchVoiceToken();
    device = new Twilio.Device(token, { logLevel: 'error' });
    device.on('tokenWillExpire', async () => {
      try {
        device.updateToken(await fetchVoiceToken());
      } catch (err) {
        console.error('[companion] token refresh failed', err);
        setState(STATES.ERROR);
      }
    });
    device.on('error', (err) => {
      console.error('[companion] device error', err);
      setState(STATES.ERROR);
    });
    return device;
  }

  function getReferrerPath() {
    try {
      return new URL(document.referrer).pathname;
    } catch { return '/'; }
  }

  async function startCall() {
    setState(STATES.CONNECTING);
    try {
      await ensureDevice();
      const call = await device.connect({ params: { public_id: public_id, path: getReferrerPath() } });
      currentCall = call;
      call.on('accept', () => setState(STATES.IN_CALL));
      call.on('disconnect', () => {
        currentCall = null;
        setState(STATES.READY);
      });
      call.on('error', (err) => {
        console.error('[companion] call error', err);
        currentCall = null;
        setState(STATES.ERROR);
      });
    } catch (err) {
      console.error('[companion] connect failed', err);
      setState(STATES.READY);
    }
  }

  function onButtonClick() {
    if (state === STATES.READY || state === STATES.ERROR) startCall();
    else if (state === STATES.IN_CALL && currentCall) currentCall.disconnect();
  }

  async function init() {
    const res = await fetch(`/public/config?public_id=${encodeURIComponent(public_id)}`);
    const data = await res.json();
    if (!data.ok) return;
    const root = document.getElementById('companion-root');
    button = document.createElement('button');
    button.className = 'companion-call-btn';
    button.title = data.button.label;
    button.innerHTML = ICONS.call;
    button.addEventListener('click', onButtonClick);
    root.appendChild(button);
    setState(STATES.READY);
  }

  init();
}());
