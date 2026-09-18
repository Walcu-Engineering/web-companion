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

  // Device preview (mic level meter before the call starts)
  var previewStream = null;
  var audioContext = null;
  var animationFrame = null;

  // Twilio call state
  var callContext = null;
  var device = null;
  var currentCall = null;

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

  function populateSelect(select, mediaDevices) {
    select.innerHTML = '';
    mediaDevices.forEach(function (mediaDevice, index) {
      var option = document.createElement('option');
      option.value = mediaDevice.deviceId;
      option.textContent = mediaDevice.label || ('Dispositivo ' + (index + 1));
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

  function initialiseDevices() {
    status.textContent = 'Comprobando dispositivos de audio…';
    deniedPanel.hidden = true;
    devicesPanel.hidden = true;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function (stream) {
        stream.getTracks().forEach(function (track) { track.stop(); });
        return navigator.mediaDevices.enumerateDevices();
      })
      .then(function (mediaDevices) {
        var microphones = mediaDevices.filter(function (mediaDevice) { return mediaDevice.kind === 'audioinput'; });
        var speakers = mediaDevices.filter(function (mediaDevice) { return mediaDevice.kind === 'audiooutput'; });
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

  window.addEventListener('message', function (event) {
    if (event.origin !== window.location.origin) return;
    if (event.source !== window.opener) return;
    if (event.data?.type !== 'walcu-call-context') return;
    if (!event.data.public_id || !event.data.token) return;

    callContext = {
      public_id: event.data.public_id,
      token: event.data.token,
      path: event.data.path || '/',
    };
  });

  async function fetchVoiceToken() {
    if (!callContext) throw new Error('missing call context');
    var params = new URLSearchParams({
      public_id: callContext.public_id,
      token: callContext.token,
    });
    var response = await fetch('/public/voice-token?' + params.toString());
    var data = await response.json();
    if (!data.ok) throw new Error('voice-token error');
    return data.token;
  }

  async function ensureDevice() {
    if (device) return device;
    if (!window.Twilio?.Device) throw new Error('Twilio SDK unavailable');

    device = new window.Twilio.Device(await fetchVoiceToken(), { logLevel: 'error' });
    device.on('tokenWillExpire', async function () {
      try {
        await device.updateToken(await fetchVoiceToken());
      } catch (err) {
        console.error('[companion] token refresh failed', err);
        status.textContent = 'No hemos podido renovar la conexión de llamada.';
      }
    });
    device.on('error', function (err) {
      console.error('[companion] device error', err);
      if (!currentCall) {
        status.textContent = 'No hemos podido preparar la llamada. Inténtalo de nuevo.';
        saveButton.disabled = false;
      }
    });
    return device;
  }

  function waitForAvailableDevice(devicesMap, deviceId) {
    if (devicesMap.has(deviceId)) return Promise.resolve(true);
    return new Promise(function (resolve) {
      var timeoutId = setTimeout(function () { finish(false); }, 2000);
      function onChange() {
        if (devicesMap.has(deviceId)) finish(true);
      }
      function finish(found) {
        clearTimeout(timeoutId);
        device.audio.removeListener('deviceChange', onChange);
        resolve(found);
      }
      device.audio.on('deviceChange', onChange);
    });
  }

  async function trySetPreferredDevice(devicesMap, deviceId, apply, label) {
    if (!deviceId) return;
    if (!(await waitForAvailableDevice(devicesMap, deviceId))) {
      return console.warn('[companion] preferred ' + label + ' not available to Twilio, using default');
    }
    try {
      await apply(deviceId);
    } catch (err) {
      console.warn('[companion] could not set preferred ' + label + ', using default', err);
    }
  }

  async function applyAudioPreferences(preferences) {
    await trySetPreferredDevice(device.audio.availableInputDevices, preferences.micDeviceId,
      function (id) { return device.audio.setInputDevice(id); }, 'mic');

    if (device.audio.isOutputSelectionSupported) {
      await trySetPreferredDevice(device.audio.availableOutputDevices, preferences.speakerDeviceId,
        function (id) { return device.audio.speakerDevices.set([id]); }, 'speaker');
    }
  }

  function restoreStartButton() {
    saveButton.disabled = false;
    saveButton.textContent = 'Iniciar llamada';
  }

  async function startCall() {
    if (currentCall) {
      currentCall.disconnect();
      return;
    }

    var preferences = {
      micDeviceId: micSelect.value || undefined,
      speakerDeviceId: outputSelectionSupported ? (speakerSelect.value || undefined) : undefined,
    };
    stopPreview();
    saveButton.textContent = 'Conectando…';
    saveButton.disabled = true;

    try {
      var activeDevice = await ensureDevice();
      await applyAudioPreferences(preferences);
      currentCall = await activeDevice.connect({
        params: { public_id: callContext.public_id, path: callContext.path },
      });
      currentCall.on('accept', function () {
        status.textContent = 'Llamada en curso.';
        saveButton.textContent = 'Colgar';
        saveButton.disabled = false;
      });
      currentCall.on('disconnect', function () {
        currentCall = null;
        status.textContent = 'La llamada ha terminado.';
        restoreStartButton();
      });
      currentCall.on('error', function (err) {
        console.error('[companion] call error', err);
        currentCall = null;
        status.textContent = 'No hemos podido iniciar la llamada. Inténtalo de nuevo.';
        restoreStartButton();
      });
    } catch (err) {
      console.error('[companion] connect failed', err);
      status.textContent = 'No hemos podido iniciar la llamada. Inténtalo de nuevo.';
      restoreStartButton();
    }
  }

  micSelect.addEventListener('change', previewSelectedMic);
  saveButton.addEventListener('click', startCall);
  reloadButton.addEventListener('click', initialiseDevices);
  window.addEventListener('pagehide', function () {
    stopPreview();
    currentCall?.disconnect();
    device?.destroy();
  });

  if (window.opener) {
    window.opener.postMessage({ type: 'walcu-call-ready' }, window.location.origin);
  }

  initialiseDevices();
}());
