(function () {
  var me = document.currentScript;
  var public_id = me && me.getAttribute('data-public-id');
  if (!public_id) return;
  var base = me.src.substring(0, me.src.lastIndexOf('/'));

  fetch(base + '/public/session?public_id=' + encodeURIComponent(public_id))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.ok) return;
      var iframe = document.createElement('iframe');
      iframe.src = base + '/embed?public_id=' + encodeURIComponent(public_id) + '&token=' + encodeURIComponent(data.token);
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('allow', 'microphone; autoplay');
      var mount_selector = (data.placement || {}).mount_selector;

      function mount(retry) {
        var target = document.querySelector(mount_selector);
        if (target) {
          iframe.style.cssText = 'border:none;width:68px;height:68px;display:block;background:transparent;';
          target.appendChild(iframe);
          window.addEventListener('message', function (ev) {
            if (ev.source !== iframe.contentWindow || !ev.data || ev.data.type !== 'companion-resize') return;
            iframe.style.width = ev.data.width + 'px';
            iframe.style.height = ev.data.height + 'px';
          });
        } else if (mount_selector && !retry && document.readyState !== 'complete') {
          document.addEventListener('DOMContentLoaded', function () { mount(true); }, { once: true });
        } else {
          iframe.style.cssText = 'border:none;width:68px;height:68px;position:fixed;bottom:24px;right:24px;z-index:9999;background:transparent;';
          document.body.appendChild(iframe);
        }
      }

      mount(false);
    })
    .catch(function () { });
}());
