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
      iframe.style.cssText = 'border:none;width:68px;height:68px;position:fixed;bottom:24px;right:24px;z-index:9999;background:transparent;';
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('allow', 'microphone; autoplay');
      document.body.appendChild(iframe);

      var modalIframe = null;

      function openModal(payload) {
        if (modalIframe) return;
        modalIframe = document.createElement('iframe');
        var qs = 'mics=' + encodeURIComponent(JSON.stringify(payload.mics || []))
          + '&speakers=' + encodeURIComponent(JSON.stringify(payload.speakers || []))
          + (payload.denied ? '&denied=1' : '');
        modalIframe.src = base + '/iframe/modal.html?' + qs;
        modalIframe.setAttribute('allow', 'microphone');
        modalIframe.style.cssText = 'border:none;position:fixed;inset:0;width:100vw;height:100vh;z-index:2147483647;background:transparent;';
        document.body.appendChild(modalIframe);
      }

      function closeModal() {
        if (!modalIframe) return;
        modalIframe.remove();
        modalIframe = null;
      }

      window.addEventListener('message', function (ev) {
        if (!ev.data) return;
        if (ev.source === iframe.contentWindow && ev.data.type === 'companion-open-modal') {
          openModal(ev.data);
        } else if (modalIframe && ev.source === modalIframe.contentWindow) {
          if (ev.data.type === 'companion-modal-close') {
            var confirmed = ev.data.confirmed;
            var prefs = ev.data.prefs;
            closeModal();
            if (confirmed) iframe.contentWindow.postMessage({ type: 'companion-call-start', prefs: prefs }, '*');
          } else if (ev.data.type === 'companion-reload-request') {
            closeModal();
            iframe.contentWindow.location.reload();
          }
        }
      });
    })
    .catch(function () { });
}());
