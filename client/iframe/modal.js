'use strict';

(function () {
  var overlay = document.getElementById('companion-modal-overlay');
  var deniedPanel = document.getElementById('companion-modal-denied');
  var devicesPanel = document.getElementById('companion-modal-devices');
  var micSelect = document.getElementById('companion-modal-mic');
  var speakerField = document.getElementById('companion-modal-speaker-field');
  var speakerSelect = document.getElementById('companion-modal-speaker');
  var meterFill = document.getElementById('companion-modal-meter-fill');
  var cta = overlay.querySelector('.companion-modal-cta');
  var reloadBtn = overlay.querySelector('.companion-modal-reload');

  var outputSelectionSupported = typeof HTMLMediaElement.prototype.setSinkId === 'function';
  var previewStream = null;
  var audioCtx = null;
  var analyser = null;
  var rafId = null;

  function send(msg) {
    window.parent.postMessage(msg, '*');
  }

  function stopMeter() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    if (audioCtx) audioCtx.close();
    audioCtx = null;
    analyser = null;
  }

  function stopPreviewStream() {
    if (previewStream) previewStream.getTracks().forEach(function (t) { t.stop(); });
    previewStream = null;
  }

  function startMeter(stream) {
    stopMeter();
    audioCtx = new AudioContext();
    var source = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    var data = new Uint8Array(analyser.frequencyBinCount);

    function tick() {
      analyser.getByteTimeDomainData(data);
      var sum = 0;
      for (var i = 0; i < data.length; i++) {
        var v = (data[i] - 128) / 128;
        sum += v * v;
      }
      var rms = Math.sqrt(sum / data.length);
      meterFill.style.width = (Math.min(1, rms * 5) * 100) + '%';
      rafId = requestAnimationFrame(tick);
    }
    tick();
  }

  // The stream here is purely for the confidence meter — it is never sent
  // anywhere. We match by label (the same physical device the button iframe
  // enumerated) against this document's own enumerateDevices(), because a
  // deviceId obtained in a different document/iframe is not guaranteed valid
  // for a getUserMedia constraint in this one.
  function previewByLabel(label) {
    stopMeter();
    stopPreviewStream();
    navigator.mediaDevices.enumerateDevices()
      .then(function (devices) {
        var match = devices.find(function (d) { return d.kind === 'audioinput' && d.label === label; });
        var constraints = match ? { audio: { deviceId: { exact: match.deviceId } } } : { audio: true };
        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then(function (stream) {
        previewStream = stream;
        startMeter(stream);
      })
      .catch(function (err) {
        console.error('[companion] preview meter failed', err);
      });
  }

  function selectedMicLabel() {
    var opt = micSelect.selectedOptions[0];
    return opt ? opt.textContent : null;
  }

  function close(confirmed) {
    stopMeter();
    stopPreviewStream();
    var prefs;
    if (confirmed) {
      prefs = {
        micDeviceId: micSelect.value || undefined,
        speakerDeviceId: outputSelectionSupported ? (speakerSelect.value || undefined) : undefined,
      };
    }
    send({ type: 'companion-modal-close', confirmed: confirmed, prefs: prefs });
  }

  overlay.addEventListener('click', function (ev) {
    if (ev.target === overlay || ev.target.closest('.companion-modal-close')) close(false);
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') close(false);
  });

  cta.addEventListener('click', function () {
    if (!cta.disabled) close(true);
  });

  if (reloadBtn) {
    reloadBtn.addEventListener('click', function () { send({ type: 'companion-reload-request' }); });
  }

  function populateSelect(select, devices) {
    select.innerHTML = '';
    devices.forEach(function (d, i) {
      var opt = document.createElement('option');
      opt.value = d.deviceId;
      opt.textContent = d.label || ('Dispositivo ' + (i + 1));
      select.appendChild(opt);
    });
  }

  micSelect.addEventListener('change', function () {
    previewByLabel(selectedMicLabel());
  });

  var params = new URLSearchParams(window.location.search);
  if (params.get('denied') === '1') {
    deniedPanel.hidden = false;
    devicesPanel.hidden = true;
    cta.disabled = true;
  } else {
    var mics = JSON.parse(params.get('mics') || '[]');
    var speakers = JSON.parse(params.get('speakers') || '[]');
    populateSelect(micSelect, mics);
    speakerField.hidden = !outputSelectionSupported || speakers.length === 0;
    if (!speakerField.hidden) populateSelect(speakerSelect, speakers);
    cta.disabled = mics.length === 0;
    if (mics.length > 0) previewByLabel(selectedMicLabel());
  }

  requestAnimationFrame(function () {
    overlay.classList.add('companion-modal-open');
  });
}());
