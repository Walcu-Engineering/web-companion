'use strict';

(function () {
  const params = new URLSearchParams(window.location.search);
  const public_id = params.get('public_id');

  if (!public_id) return;

  fetch('/public/config?public_id=' + encodeURIComponent(public_id))
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.ok) return;
      var root = document.getElementById('companion-root');
      var button = document.createElement('button');
      button.textContent = data.button.label;
      button.className = 'companion-call-btn';
      root.appendChild(button);
    })
    .catch(function () { });
}());
