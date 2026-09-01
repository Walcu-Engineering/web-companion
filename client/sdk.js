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
    })
    .catch(function () { });
}());
