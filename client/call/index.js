(function () {
  var status = document.getElementById('call-status');
  var deniedPanel = document.getElementById('call-denied');
  var devicesPanel = document.getElementById('call-devices');
  var micSelect = document.getElementById('call-mic');
  var speakerField = document.getElementById('call-speaker-field');
  var speakerSelect = document.getElementById('call-speaker');
  var meterFill = document.getElementById('call-meter-fill');
  var saveButton = document.getElementById('call-save');
  var reloadButton = document.getElementById('call-reload');
  if (!status) return;

  var outputSelectionSupported = typeof HTMLMediaElement.prototype.setSinkId === 'function';
  var previewStream = null;
  var audioContext = null;
  var animationFrame = null;

  function stopMeter() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = null;
    if (audioContext) audioContext.close();
    audioContext = null;
  }

  function stopPreview() {
    stopMeter();
    if (previewStream) previewStream.getTracks().forEach(function (track) { track.stop(); });
    previewStream = null;
  }

  function populateSelect(select, devices) {
    select.innerHTML = '';
    devices.forEach(function (device, index) {
      var option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || ('Dispositivo ' + (index + 1));
      select.appendChild(option);
    });
  }

  function startMeter(stream) {
    audioContext = new AudioContext();
    var source = audioContext.createMediaStreamSource(stream);
    var analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    var data = new Uint8Array(analyser.frequencyBinCount);

    function tick() {
      analyser.getByteTimeDomainData(data);
      var sum = 0;
      for (var index = 0; index < data.length; index++) {
        var value = (data[index] - 128) / 128;
        sum += value * value;
      }
      meterFill.style.width = (Math.min(1, Math.sqrt(sum / data.length) * 5) * 100) + '%';
      animationFrame = requestAnimationFrame(tick);
    }
    tick();
  }

  function previewSelectedMic() {
    stopPreview();
    navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: micSelect.value } } })
      .then(function (stream) {
        previewStream = stream;
        startMeter(stream);
      })
      .catch(function (err) {
        console.error('[companion] preview meter failed', err);
      });
  }

  function showDenied() {
    status.textContent = 'Necesitamos acceso al micrófono.';
    deniedPanel.hidden = false;
    devicesPanel.hidden = true;
  }

  function savePreferences() {
    window.__walcuCallPreferences = {
      micDeviceId: micSelect.value || undefined,
      speakerDeviceId: outputSelectionSupported ? (speakerSelect.value || undefined) : undefined,
    };
    stopPreview();
    status.textContent = 'Preferencias guardadas. La llamada estará disponible a continuación.';
    saveButton.textContent = 'Preferencias guardadas';
    saveButton.disabled = true;
  }

  function initialiseDevices() {
    status.textContent = 'Comprobando dispositivos de audio…';
    deniedPanel.hidden = true;
    devicesPanel.hidden = true;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(function (devices) {
        var microphones = devices.filter(function (device) { return device.kind === 'audioinput'; });
        var speakers = devices.filter(function (device) { return device.kind === 'audiooutput'; });
        if (!microphones.length) throw new Error('no microphone found');
        populateSelect(micSelect, microphones);
        speakerField.hidden = !outputSelectionSupported || !speakers.length;
        if (!speakerField.hidden) populateSelect(speakerSelect, speakers);
        status.textContent = 'Elige los dispositivos que usarás en la llamada.';
        devicesPanel.hidden = false;
        saveButton.disabled = false;
        previewSelectedMic();
      })
      .catch(function (err) {
        console.error('[companion] microphone setup failed', err);
        showDenied();
      });
  }

  micSelect.addEventListener('change', previewSelectedMic);
  saveButton.addEventListener('click', savePreferences);
  reloadButton.addEventListener('click', initialiseDevices);
  window.addEventListener('pagehide', stopPreview);

  initialiseDevices();
}());
