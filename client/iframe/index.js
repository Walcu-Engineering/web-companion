'use strict';

(function () {
  const public_id = new URLSearchParams(window.location.search).get('public_id');
  const token = new URLSearchParams(window.location.search).get('token');
  if (!public_id || !token) return;

  const ICONS = {
    call: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>',
  };

  let callWindow = null;
  let button = null;

  function sendCallContext(targetWindow) {
    targetWindow.postMessage({
      type: 'walcu-call-context',
      public_id: public_id,
      token: token,
      path: getReferrerPath(),
    }, window.location.origin);
  }

  function getReferrerPath() {
    try {
      return new URL(document.referrer).pathname;
    } catch { return '/'; }
  }

  function openCallWindow() {
    try {
      if (callWindow && !callWindow.closed) {
        callWindow.focus();
        return;
      }

      const openedWindow = window.open('', 'walcu-call', 'popup,width=400,height=640');
      if (!openedWindow) throw new Error('popup blocked');

      callWindow = openedWindow;
      try {
        if (openedWindow.location.href === 'about:blank') {
          openedWindow.location.replace('/call');
        }
      } catch (_) {
        // A named window owned by another origin cannot be inspected or navigated here.
      }
      openedWindow.focus();
      button.title = 'Abrir llamada';
    } catch (err) {
      console.error('[companion] could not open call window', err);
      button.title = 'Permite ventanas emergentes para llamar';
    }
  }

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== callWindow) return;
    if (event.data?.type !== 'walcu-call-ready') return;

    sendCallContext(callWindow);
  });

  function onButtonClick() {
    openCallWindow();
  }

  async function init() {
    const res = await fetch(`/public/config?public_id=${encodeURIComponent(public_id)}&token=${encodeURIComponent(token)}`);
    const data = await res.json();
    if (!data.ok) return;
    const root = document.getElementById('companion-root');
    button = document.createElement('button');
    button.className = 'companion-call-btn';
    button.title = data.button.label;
    button.innerHTML = ICONS.call;
    button.addEventListener('click', onButtonClick);
    root.appendChild(button);
  }

  init();
}());
