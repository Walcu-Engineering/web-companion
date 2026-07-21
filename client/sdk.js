(function () {
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
}());
