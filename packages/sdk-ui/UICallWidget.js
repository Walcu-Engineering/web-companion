// ── SVG icon paths ────────────────────────────────────────────────

const SVG_PATHS = {
  phone:   `<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>`,
  hangup:  `<path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.84-.18.18-.43.28-.69.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.67 0-.25.11-.49.29-.67C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.74c.18.18.29.42.29.67 0 .25-.11.49-.29.67l-2.49 2.49c-.18.18-.43.29-.71.29-.26 0-.51-.1-.69-.28-.79-.72-1.68-1.35-2.67-1.84-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>`,
  spinner: `<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>`,
  warning: `<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>`,
  close:   `<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>`,
}

function svg(name) {
  return `<svg class="icon" viewBox="0 0 24 24">${SVG_PATHS[name]}</svg>`
}

// ── State definitions ─────────────────────────────────────────────

const STATES = {
  idle: {
    title:      '¿Hablamos?',
    text:       'Pulsa el botón inferior para iniciar la llamada.',
    btnClass:   '',
    btnIcon:    'phone',
    btnLabel:   'Llamar ahora',
    disabled:   false,
    floatClass: '',
    floatIcon:  'phone',
  },
  connecting: {
    title:      'Conectando...',
    text:       'Estableciendo conexión. Espere...',
    btnClass:   'action-btn--connecting',
    btnIcon:    'spinner',
    btnLabel:   'Conectando...',
    disabled:   true,
    floatClass: 'widget-btn--connecting',
    floatIcon:  'phone',
  },
  'in-call': {
    title:      'En llamada',
    text:       'Pulsa Colgar para finalizar.',
    btnClass:   'action-btn--in-call',
    btnIcon:    'hangup',
    btnLabel:   'Colgar',
    disabled:   false,
    floatClass: 'widget-btn--in-call',
    floatIcon:  'hangup',
  },
  error: {
    title:      'Error en llamada',
    text:       'No se pudo establecer conexión.',
    btnClass:   'action-btn--error',
    btnIcon:    'warning',
    btnLabel:   'Reintentar',
    disabled:   false,
    floatClass: 'widget-btn--error',
    floatIcon:  'phone',
  },
}

// ── Styles ────────────────────────────────────────────────────────

function floatButtonStyles(color) {
  return `
    .widget-btn {
      all: initial;
      width: 60px;
      height: 60px;
      background-color: ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }
    .widget-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    }
    .widget-btn--in-call {
      background-color: #e53935;
      animation: pulse-red 1.5s ease-in-out infinite;
    }
    .widget-btn--connecting {
      background-color: #9e9e9e;
      animation: pulse-grey 1.5s ease-in-out infinite;
    }
    .widget-btn--error { background-color: #f57c00; }
    @keyframes pulse-red {
      0%, 100% { box-shadow: 0 4px 12px rgba(229,57,53,0.4); }
      50%       { box-shadow: 0 4px 24px rgba(229,57,53,0.8); }
    }
    @keyframes pulse-grey {
      0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
      50%       { box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
    }
    .icon { width: 28px; height: 28px; fill: #ffffff; display: block; }
  `
}

function modalStyles(color) {
  return `
    :host { all: initial; }
    .modal-content {
      background: #ffffff;
      width: 320px;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      position: relative;
      text-align: center;
      animation: slideUp 0.3s ease-out;
    }
    .close-btn {
      all: initial;
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #f0f0f0;
      transition: background 0.2s;
    }
    .close-btn:hover { background: #e0e0e0; }
    .close-btn .icon { width: 16px; height: 16px; fill: #333; }
    h2 { margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a; }
    p  { margin: 0 0 24px 0; font-size: 14px; color: #666; line-height: 1.5; }
    .action-btn {
      display: block;
      margin: 0 auto;
      background-color: ${color};
      color: #ffffff;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;
      transition: filter 0.2s;
    }
    .action-btn:hover    { filter: brightness(0.9); }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; filter: none; }
    .action-btn--in-call    { background-color: #e53935; }
    .action-btn--error      { background-color: #f57c00; }
    .action-btn--connecting { background-color: #9e9e9e; }
    .action-btn .icon {
      width: 18px;
      height: 18px;
      fill: #ffffff;
      vertical-align: middle;
      margin-right: 8px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .action-btn--connecting .icon { animation: spin 1s linear infinite; }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `
}

// ── HTML templates ────────────────────────────────────────────────

function floatButtonTemplate(color) {
  return `
    <style>${floatButtonStyles(color)}</style>
    <button class="widget-btn" title="Llámanos">
      ${svg('phone')}
    </button>
  `
}

function modalTemplate(color) {
  return `
    <style>${modalStyles(color)}</style>
    <div class="modal-content">
      <button class="close-btn" aria-label="Cerrar">${svg('close')}</button>
      <h2>¿Hablamos?</h2>
      <p>Pulsa el botón inferior para iniciar la llamada directamente.</p>
      <button class="action-btn">
        ${svg('phone')}
        Llamar ahora
      </button>
    </div>
  `
}

// ── UICallWidget ──────────────────────────────────────────────────

class UICallWidget {
  constructor(config = {}) {
    this.color = config.color || '#25D366'
    this.position = config.position || 'bottom-right'
    this._callState = 'idle'
    this.isModalOpen = false

    this._init()
  }

  _init() {
    this._createPhoneButton()
    this._createModal()
  }

  _createPhoneButton() {
    const existing = document.getElementById('sdk-phone-button')
    if (existing) {
      this._floatBtn  = existing.shadowRoot.querySelector('.widget-btn')
      this._floatIcon = existing.shadowRoot.querySelector('.icon')
      return
    }

    const host = document.createElement('div')
    host.id = 'sdk-phone-button'
    host.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;'

    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = floatButtonTemplate(this.color)

    shadow.querySelector('.widget-btn').addEventListener('click', () =>
      this.toggleModal(true)
    )

    this._floatBtn  = shadow.querySelector('.widget-btn')
    this._floatIcon = shadow.querySelector('.icon')

    document.body.appendChild(host)
  }

  _createModal() {
    this.modalHost = document.createElement('div')
    this.modalHost.id = 'sdk-modal'
    this.modalHost.style.cssText =
      'position: fixed; bottom: 96px; right: 24px; z-index: 2147483647; display: none;'

    const shadow = this.modalHost.attachShadow({ mode: 'open' })
    shadow.innerHTML = modalTemplate(this.color)

    shadow.querySelector('.close-btn').addEventListener('click', () =>
      this.toggleModal(false)
    )

    this._actionBtn  = shadow.querySelector('.action-btn')
    this._modalTitle = shadow.querySelector('h2')
    this._modalText  = shadow.querySelector('p')

    this._actionBtn.addEventListener('click', () => {
      if (this._callState === 'idle' || this._callState === 'error') {
        window.dispatchEvent(new CustomEvent('sdk:call-requested'))
      } else if (this._callState === 'in-call') {
        window.dispatchEvent(new CustomEvent('sdk:hangup-requested'))
      }
    })

    window.addEventListener('sdk:call-connecting', () => this._setCallState('connecting'))
    window.addEventListener('sdk:call-started',    () => this._setCallState('in-call'))
    window.addEventListener('sdk:call-ended',      () => this._setCallState('idle'))
    window.addEventListener('sdk:call-error',      () => this._setCallState('error'))

    document.body.appendChild(this.modalHost)
  }

  _setCallState(state) {
    const def = STATES[state]
    if (!def) return

    this._callState = state

    // modal
    this._modalTitle.textContent = def.title
    this._modalText.textContent  = def.text
    this._actionBtn.className    = `action-btn${def.btnClass ? ' ' + def.btnClass : ''}`
    this._actionBtn.disabled     = def.disabled
    this._actionBtn.innerHTML    = `${svg(def.btnIcon)} ${def.btnLabel}`

    // float button
    this._floatBtn.className      = `widget-btn${def.floatClass ? ' ' + def.floatClass : ''}`
    this._floatIcon.innerHTML     = SVG_PATHS[def.floatIcon]
  }

  toggleModal(isOpen) {
    this.isModalOpen = isOpen
    this.modalHost.style.display = isOpen ? 'block' : 'none'
  }
}

window.UICallWidget = UICallWidget
