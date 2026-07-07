(function () {
  var me = document.currentScript;
  var public_id = me && me.getAttribute('data-public-id');
  if (!public_id) return;
  var base = me.src.substring(0, me.src.lastIndexOf('/'));
  var iframe = document.createElement('iframe');
  iframe.src = base + '/embed?public_id=' + encodeURIComponent(public_id);
  iframe.style.cssText = 'border:none;width:68px;height:68px;position:fixed;bottom:24px;right:24px;z-index:9999;background:transparent;';
  iframe.setAttribute('allowtransparency', 'true');
  document.body.appendChild(iframe);
}());
