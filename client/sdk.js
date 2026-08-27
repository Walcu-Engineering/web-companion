(function () {
  if (window.__walcuInit) return;
  window.__walcuInit = true;

  var VISITOR_ID_KEY = '_walcu_visitor_id';
  var SESSION_ID_KEY = '_walcu_session_id';
  var ORIGIN_KEY     = '_walcu_origin';

  function uuidv4() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    var bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = [];
    for (var j = 0; j < 16; j++) hex.push(('0' + bytes[j].toString(16)).slice(-2));
    return hex.slice(0, 4).join('') + '-' + hex.slice(4, 6).join('') + '-' +
      hex.slice(6, 8).join('') + '-' + hex.slice(8, 10).join('') + '-' + hex.slice(10, 16).join('');
  }

  function getOrCreateId(storage, key) {
    try {
      var id = storage.getItem(key);
      if (!id) {
        id = uuidv4();
        storage.setItem(key, id);
      }
      return id;
    } catch (e) {
      // Storage can throw (private mode, cookies disabled...)
      return uuidv4();
    }
  }

  function parseOriginFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var source = params.get('utm_source');
    if (source) {
      return { source: source, medium: params.get('utm_medium') || '', campaign: params.get('utm_campaign') || '' };
    }
    if (document.referrer) {
      try {
        var refHost = new URL(document.referrer).hostname;
        if (refHost && refHost !== window.location.hostname) {
          return { source: refHost, medium: 'referral', campaign: '' };
        }
      } catch (e) { /* unparseable referrer, fall through to direct */ }
    }
    return { source: 'direct', medium: 'none', campaign: '' };
  }

  function getFirstTouchOrigin() {
    try {
      var stored = window.localStorage.getItem(ORIGIN_KEY);
      if (stored) return JSON.parse(stored);
      var origin = parseOriginFromUrl();
      window.localStorage.setItem(ORIGIN_KEY, JSON.stringify(origin));
      return origin;
    } catch (e) {
      return parseOriginFromUrl();
    }
  }

  var me = document.currentScript;
  var public_id = me && me.getAttribute('data-public-id');
  if (!public_id) return;

  var visitor_id = getOrCreateId(window.localStorage, VISITOR_ID_KEY);
  var session_id = getOrCreateId(window.sessionStorage, SESSION_ID_KEY);
  var origin = getFirstTouchOrigin();

  var base = me.src.substring(0, me.src.lastIndexOf('/'));
  var query = new URLSearchParams({
    public_id: public_id,
    visitor_id: visitor_id,
    session_id: session_id,
    page_url: window.location.href,
    page_title: document.title,
    origin_source: origin.source,
    origin_medium: origin.medium,
    origin_campaign: origin.campaign
  });

  var iframe = document.createElement('iframe');
  iframe.src = base + '/embed?' + query.toString();
  iframe.style.cssText = 'border:none;width:68px;height:68px;position:fixed;bottom:24px;right:24px;z-index:9999;background:transparent;';
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('allow', 'microphone; autoplay');
  document.body.appendChild(iframe);

  // --- autocapture: auto_pageview + auto_click -------------------------

  var EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  var LONG_DIGIT_RE = /\d[\d\s-]{6,}\d/g;

  function scrubText(text) {
    if (!text) return '';
    return String(text)
      .replace(EMAIL_RE, '[redacted]')
      .replace(LONG_DIGIT_RE, '[redacted]')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
  }

  function looksGenerated(token) {
    return /^(css-|sc-|jsx-)/.test(token) || /^[a-f0-9]{6,}$/i.test(token);
  }

  var PREFERRED_DATA_ATTRS = ['data-testid', 'data-qa', 'data-cy', 'data-track'];
  var VOLATILE_DATA_ATTR_RE = /^data-(v-|reactid|react-)/;

  function findDataAttr(el) {
    var attrs = el.attributes || [];
    for (var i = 0; i < PREFERRED_DATA_ATTRS.length; i++) {
      var found = Array.prototype.find.call(attrs, function (a) { return a.name === PREFERRED_DATA_ATTRS[i]; });
      if (found) return found;
    }
    return Array.prototype.find.call(attrs, function (a) {
      return /^data-/.test(a.name) && !VOLATILE_DATA_ATTR_RE.test(a.name);
    });
  }

  function nodeSelector(el) {
    if (el.id && !/^\d/.test(el.id) && !looksGenerated(el.id)) return '#' + CSS.escape(el.id);

    var dataAttr = findDataAttr(el);
    if (dataAttr) return '[' + dataAttr.name + '="' + CSS.escape(dataAttr.value) + '"]';

    var cls = (typeof el.className === 'string')
      ? el.className.trim().split(/\s+/).filter(function (c) { return c && !looksGenerated(c); })
      : [];
    if (cls.length) return el.tagName.toLowerCase() + cls.map(function (c) { return '.' + CSS.escape(c); }).join('');

    var parent = el.parentElement;
    if (!parent) return el.tagName.toLowerCase();
    var siblings = Array.prototype.filter.call(parent.children, function (s) { return s.tagName === el.tagName; });
    return el.tagName.toLowerCase() + ':nth-of-type(' + (siblings.indexOf(el) + 1) + ')';
  }

  function generateSelector(el) {
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 5) {
      parts.unshift(nodeSelector(node));
      if (node.id) break;
      node = node.parentElement;
      depth++;
    }
    return parts.join(' > ');
  }

  function describeElement(el) {
    return {
      selector: generateSelector(el),
      tag: el.tagName.toLowerCase(),
      text: scrubText(el.textContent),
      href: el.tagName === 'A' ? (el.getAttribute('href') || '') : ''
    };
  }

  var eventBuffer = [];
  function pushEvent(event_type, extra) {
    eventBuffer.push(Object.assign({
      event_type: event_type,
      page_url: window.location.href,
      page_title: document.title
    }, extra || {}));
  }

  function sendViaFetch(payload) {
    fetch(base + '/public/events/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(function () {});
  }

  function flushEvents(useBeacon) {
    if (!eventBuffer.length) return;
    var payload = JSON.stringify({
      public_id: public_id,
      visitor_id: visitor_id,
      session_id: session_id,
      events: eventBuffer.splice(0)
    });
    var sentViaBeacon = useBeacon && navigator.sendBeacon &&
      navigator.sendBeacon(base + '/public/events/batch', new Blob([payload], { type: 'application/json' }));
    if (!sentViaBeacon) sendViaFetch(payload);
  }

  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest && e.target.closest('button, a, [role="button"], input[type="submit"]');
    if (!el) return;
    pushEvent('auto_click', { target: describeElement(el) });
  }, { capture: true, passive: true });

  var lastPageviewUrl = null;
  function emitPageview() {
    if (window.location.href === lastPageviewUrl) return;
    lastPageviewUrl = window.location.href;
    pushEvent('auto_pageview', {});
  }
  emitPageview();
  ['pushState', 'replaceState'].forEach(function (fn) {
    var orig = history[fn];
    history[fn] = function () {
      var ret = orig.apply(this, arguments);
      emitPageview();
      return ret;
    };
  });
  window.addEventListener('popstate', emitPageview);

  setInterval(function () { flushEvents(false); }, 5000);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') flushEvents(true);
  });
  window.addEventListener('pagehide', function () { flushEvents(true); });
}());
