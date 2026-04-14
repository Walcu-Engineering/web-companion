class UICallWidget {
  constructor(config = {}) {
    this.phoneNumber = config.phoneNumber || '+34000000000';
    this.color = config.color || '#25D366';
    this.position = config.position || 'bottom-right';
    this._callState = 'idle'

    // state to handle modal
    this.isModalOpen = false

    this.init();
  }

  init() {
    this.createPhoneButton()
    this.createModal()
  }

  createPhoneButton() {
    // avoid duplicate injections if case
    if (document.getElementById('sdk-phone-button')) return;

    // Create the private DOM host in the normal DOM
    // We create a shadow-root in this host
    const host = document.createElement('div');
    host.id = 'sdk-phone-button';
    // without this config host doesn't show
    host.style.position = 'fixed';
    host.style.bottom = '24px';
    host.style.right = '24px';
    host.style.zIndex = '2147483647';

    const shadow = host.attachShadow({ mode: 'open' });

    // phone icon code HTML+CSS
    shadow.innerHTML = `
      <style>
        /* 
          ESTILOS AISLADOS:
          Puedes usar clases genéricas sin miedo a colisiones.
          Nada de la web principal entrará aquí (excepto propiedades heredables como font-family, 
          por eso usamos 'all: initial' en el contenedor principal).
        */
        .widget-btn {
          all: initial; /* Resetea cualquier herencia de la web padre */
          width: 60px;
          height: 60px;
          background-color: ${this.color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          box-sizing: border-box;
        }

        .widget-btn--in-call {
          background-color: #e53935;
          animation: pulse-red 1.5s ease-in-out infinite;
        }
        .widget-btn--connecting {
          background-color: #9e9e9e;
          animation: pulse-grey 1.5s ease-in-out infinite;
        }
        .widget-btn--error {
          background-color: #f57c00;
        }

        @keyframes pulse-red {
          0%, 100% { box-shadow: 0 4px 12px
        rgba(229,57,53,0.4); }
          50%       { box-shadow: 0 4px 24px
        rgba(229,57,53,0.8); }
        }
        @keyframes pulse-grey {
          0%, 100% { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
          50%      { box-shadow: 0 4px 24px rgba(0,0,0,0.3);  }
        }

        .widget-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        }

        .icon {
          width: 28px;
          height: 28px;
          fill: #ffffff;
          display: block;
        }
      </style>

      <!-- HTML AISLADO -->
      <button class="widget-btn" href="tel:${this.phoneNumber}" title="Llámanos">
        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </button>
    `;

    shadow.querySelector('.widget-btn').addEventListener('click', () =>
      this.toggleModal(true)
    )

    this._floatBtn = shadow.querySelector('.widget-btn')
    this._floatIcon = shadow.querySelector('.icon')

    document.body.appendChild(host);
  }

  _setFLoatState(state) {
    const btn = this._floatBtn
    const icon = this._floatIcon

    btn.className = 'widget-btn'

    const phoneIcon = `<path d="M6.62 10.79c1.44 2.83
      3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24
      1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45
      1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1
      .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25
      1.02l-2.2 2.2z"/>`

    const hangupIcon = `<path d="M12 9c-1.6
      0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87
      1.12-2.66 1.84-.18.18-.43.28-.69.28-.28
      0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.67
      0-.25.11-.49.29-.67C3.34 8.78 7.46 7 12 7s8.66 1.78
      11.71 4.74c.18.18.29.42.29.67 0
      .25-.11.49-.29.67l-2.49 2.49c-.18.18-.43.29-.71.29-.26
      0-.51-.1-.69-.28-.79-.72-1.68-1.35-2.67-1.84-.33-.16-
      .56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>`

    if (state === 'idle') {
      icon.innerHTML = phoneIcon
    } else if (state === 'connecting') {
      btn.classList.add('widget-btn--connecting')
    } else if (state === 'in-call') {
      btn.callList.add('widget-btn--in-call')
      icon.innerHTML = hangupIcon
    } else if (state === 'error') {
      btn.classList.add('widget-btn--error')
      icon.innerHTML = phoneIcon
    }

  }


  createModal() {
    this.modalHost = document.createElement('div')
    this.modalHost.id = 'sdk-modal'

    this.modalHost.style.cssText = 'position: fixed; bottom: 96px; right: 24px; z-index: 2147483647; display: none;'

    const shadow = this.modalHost.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
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

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: none;
        }

        .close-btn:hover { background: #e0e0e0; }
        .close-btn svg { width: 16px; height: 16px; fill: #333; }
        
        h2 { margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a; }
        p { margin: 0 0 24px 0; font-size: 14px; color: #666; line-height: 1.5; }
        
        .action-btn {
          display: block;
          margin: 0 auto;
          background-color: ${this.color};
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: filter 0.2s;
        }
        .action-btn:hover { filter: brightness(0.9); }

        .action-btn--in-call {
          background-color: #e53935;
        }
        .action-btn--error {
          background-color: #f57c00;
        }
        .action-btn--connecting {
          background-color: #9e9e9e;
        }
        .action-btn svg {
          width: 18px;
          height: 18px;
          fill: #ffffff;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .action-btn--connecting svg {
          animation: spin 1s linear infinite;
        }



        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      </style>

        <div class="modal-content">
          <button class="close-btn" aria-label="Cerrar">
            <!-- Icono de aspa (X) -->
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
          <h2>¿Hablamos?</h2>
          <p>Pulsa el botón inferior para iniciar la llamada directamente.</p>
            <button class="action-btn">
                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44
                  2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36
                  1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0
                  .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1
                  1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57
                  3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                Llamar ahora
            </button>
        </div>
    `
    const closeBtn = shadow.querySelector('.close-btn')

    // close on click at x
    closeBtn.addEventListener('click', () => this.toggleModal(false));

    this._actionBtn = shadow.querySelector('.action-btn')

    // to connect both SDK, we use window.dispatchEvent
    // the other SDK only connect to the event
    this._actionBtn.addEventListener('click', () => {
      if (this._callState === 'idle' || this._callState === 'error') {
        window.dispatchEvent(new CustomEvent('sdk:call-requested'))
      } else if (this._callState === 'in-call') {
        window.dispatchEvent(new CustomEvent('sdk:hangup-requested'))
      }
    })


    window.addEventListener('sdk:call-connecting', () =>
      this._setCallState('connecting'))
    window.addEventListener('sdk:call-started', () =>
      this._setCallState('in-call'))
    window.addEventListener('sdk:call-ended', () =>
      this._setCallState('idle'))
    window.addEventListener('sdk:call-error', () =>
      this._setCallState('error'))



    document.body.appendChild(this.modalHost)
  }

  _setCallState(state) {
    this._callState = state
    const btn = this._actionBtn

    btn.className = 'action-btn'

    if (state === 'idle') {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M6.62
          10.79c1.44 2.83 3.76 5.14 6.59
          6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57
          3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39
          0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0
          1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2
          2.2z"/>
        </svg>
        Llamar ahora
      `
      btn.disabled = false
    } else if (state === 'connecting') {
      btn.classList.add('action-btn--connecting')
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M12 4V1L8 5l4
          4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46
          1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0
          14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24
          7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8
          8v3l4-4-4-4v3z"/>
        </svg>
        Conectando...
      `
      btn.disabled = true
    } else if (state === 'in-call') {
      btn.callList.add('action-btn--in-call')
      btn.innerHTML = `
         <svg viewBox="0 0 24 24"><path d="M12 9c-1.6
          0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87
          1.12-2.66 1.84-.18.18-.43.28-.69.28-.28
          0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.67
          0-.25.11-.49.29-.67C3.34 8.78 7.46 7 12 7s8.66 1.78
          11.71 4.74c.18.18.29.42.29.67 0
          .25-.11.49-.29.67l-2.49 2.49c-.18.18-.43.29-.71.29-.26
          0-.51-.1-.69-.28-.79-.72-1.68-1.35-2.67-1.84-.33-.16-
          .56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
         </svg>
        Colgar
      `
      btn.disabled = false
    } else if (state === 'error') {
      btn.classList.add('action-btn--error')
      btn.innerHTML = `
        <svg viewBox="0 0 24 24"><path d="M1 21h22L12 2
          1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        Reintentar
      `
      btn.disabled = false
    }

    this._setFLoatState(state)
  }


  toggleModal(isOpen) {
    this.isModalOpen = isOpen
    this.modalHost.style.display = this.isModalOpen ? 'block' : 'none';
  }
}
window.UICallWidget = UICallWidget

