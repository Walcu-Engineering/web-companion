(function () {
  var title = document.getElementById('call-title');
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

  var activePanel = document.getElementById('call-active');
  var timerEl = document.getElementById('call-timer');
  var muteButton = document.getElementById('call-mute');
  var muteIcon = document.getElementById('call-mute-icon');
  var micChevron = document.getElementById('call-mic-chevron');
  var micPopover = document.getElementById('call-mic-popover');
  var speakerGroup = document.getElementById('call-speaker-group');
  var speakerButton = document.getElementById('call-speaker-btn');
  var speakerChevron = document.getElementById('call-speaker-chevron');
  var speakerPopover = document.getElementById('call-speaker-popover');
  var hangupButton = document.getElementById('call-hangup');

  var MIC_ON_PATH = '<path d="M12 14a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 1 0-7 0v5A3.5 3.5 0 0 0 12 14Zm-5-3.5a1 1 0 1 1 2 0 3 3 0 0 0 6 0 1 1 0 1 1 2 0 5 5 0 0 1-4 4.9V19h2a1 1 0 1 1 0 2H9a1 1 0 0 1 0-2h2v-2.6a5 5 0 0 1-4-4.9Z"/>';
  var MIC_OFF_PATH = '<path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>';

  var outputSelectionSupported = typeof HTMLMediaElement.prototype.setSinkId === 'function';
  speakerGroup.hidden = !outputSelectionSupported;

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

  function showActive() {
    deniedPanel.hidden = true;
    devicesPanel.hidden = true;
    activePanel.hidden = false;
    title.hidden = true;
    status.hidden = true;
  }

  function hideActive() {
    activePanel.hidden = true;
    devicesPanel.hidden = false;
    title.hidden = false;
    status.hidden = false;
  }

  var timerIntervalId = null;
  var callStartedAt = null;

  function updateTimer() {
    var elapsed = Math.floor((Date.now() - callStartedAt) / 1000);
    var minutes = Math.floor(elapsed / 60);
    var seconds = elapsed % 60;
    timerEl.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function startTimer() {
    callStartedAt = Date.now();
    timerEl.textContent = '00:00';
    timerIntervalId = setInterval(updateTimer, 250);
  }

  function stopTimer() {
    if (timerIntervalId) clearInterval(timerIntervalId);
    timerIntervalId = null;
    callStartedAt = null;
  }

  function updateMuteUI(isMuted) {
    muteButton.setAttribute('aria-pressed', String(isMuted));
    muteButton.classList.toggle('is-active', isMuted);
    muteIcon.innerHTML = isMuted ? MIC_OFF_PATH : MIC_ON_PATH;
  }

  function toggleMute() {
    if (!currentCall) return;
    var next = !currentCall.isMuted();
    currentCall.mute(next);
    updateMuteUI(next);
  }

  function closeAllPopovers() {
    micPopover.hidden = true;
    speakerPopover.hidden = true;
    micChevron.setAttribute('aria-expanded', 'false');
    speakerChevron.setAttribute('aria-expanded', 'false');
    speakerButton.setAttribute('aria-expanded', 'false');
  }

  function renderPopoverList(popoverEl, mediaDevices, onPick) {
    popoverEl.innerHTML = '';
    if (!mediaDevices.length) {
      var empty = document.createElement('p');
      empty.className = 'call-popover-empty';
      empty.textContent = 'No se han encontrado dispositivos.';
      popoverEl.appendChild(empty);
      return;
    }
    mediaDevices.forEach(function (mediaDevice, index) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'call-popover-item';
      item.setAttribute('role', 'option');
      item.textContent = mediaDevice.label || ('Dispositivo ' + (index + 1));
      item.addEventListener('click', function () { onPick(mediaDevice.deviceId); });
      popoverEl.appendChild(item);
    });
  }

  function openMicPopover() {
    var wasOpen = !micPopover.hidden;
    closeAllPopovers();
    if (wasOpen) return;
    navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
      var mics = mediaDevices.filter(function (mediaDevice) { return mediaDevice.kind === 'audioinput'; });
      renderPopoverList(micPopover, mics, function (deviceId) {
        applyAudioPreferences({ micDeviceId: deviceId });
        closeAllPopovers();
      });
      micPopover.hidden = false;
      micChevron.setAttribute('aria-expanded', 'true');
    });
  }

  function openSpeakerPopover() {
    var wasOpen = !speakerPopover.hidden;
    closeAllPopovers();
    if (wasOpen) return;
    navigator.mediaDevices.enumerateDevices().then(function (mediaDevices) {
      var speakers = mediaDevices.filter(function (mediaDevice) { return mediaDevice.kind === 'audiooutput'; });
      renderPopoverList(speakerPopover, speakers, function (deviceId) {
        applyAudioPreferences({ speakerDeviceId: deviceId });
        closeAllPopovers();
      });
      speakerPopover.hidden = false;
      speakerChevron.setAttribute('aria-expanded', 'true');
      speakerButton.setAttribute('aria-expanded', 'true');
    });
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
        saveButton.textContent = 'Colgar';
        saveButton.disabled = false;
        showActive();
        updateMuteUI(false);
        startTimer();
      });
      currentCall.on('disconnect', function () {
        currentCall = null;
        stopTimer();
        window.close();
      });
      currentCall.on('error', function (err) {
        console.error('[companion] call error', err);
        currentCall = null;
        status.textContent = 'No hemos podido iniciar la llamada. Inténtalo de nuevo.';
        stopTimer();
        closeAllPopovers();
        hideActive();
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
  muteButton.addEventListener('click', toggleMute);
  micChevron.addEventListener('click', function (event) { event.stopPropagation(); openMicPopover(); });
  speakerButton.addEventListener('click', function (event) { event.stopPropagation(); openSpeakerPopover(); });
  speakerChevron.addEventListener('click', function (event) { event.stopPropagation(); openSpeakerPopover(); });
  hangupButton.addEventListener('click', function () { currentCall?.disconnect(); });
  document.addEventListener('click', function (event) {
    if (micPopover.contains(event.target) || speakerPopover.contains(event.target)) return;
    closeAllPopovers();
  });
  window.addEventListener('pagehide', function () {
    stopPreview();
    stopTimer();
    currentCall?.disconnect();
    device?.destroy();
  });

  if (window.opener) {
    window.opener.postMessage({ type: 'walcu-call-ready' }, window.location.origin);
  }

  initialiseDevices();
}());
