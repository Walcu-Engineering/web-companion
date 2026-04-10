class CallWidgetSDK {
  constructor(config = {}) {
    this.phoneNumber = config.phoneNumber || '+34000000000';
    this.color = config.color || '#25D366';
    this.position = config.position || 'bottom-right';

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

    document.body.appendChild(host);
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
        .close-btn:hover { background: #e0e0e0; }
        .close-btn svg { width: 16px; height: 16px; fill: #333; }
        
        h2 { margin: 0 0 8px 0; font-size: 20px; color: #1a1a1a; }
        p { margin: 0 0 24px 0; font-size: 14px; color: #666; line-height: 1.5; }
        
        .action-link {
          display: block;
          background-color: ${this.color};
          color: #ffffff;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: filter 0.2s;
        }
        .action-link:hover { filter: brightness(0.9); }

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
          <a href="tel:${this.phoneNumber}" class="action-link">Llamar ahora</a>
        </div>
    `
    const closeBtn = shadow.querySelector('.close-btn')

    // close on click at x
    closeBtn.addEventListener('click', () => this.toggleModal(false));

    document.body.appendChild(this.modalHost)
  }
  toggleModal(isOpen) {
    this.isModalOpen = isOpen
    this.modalHost.style.display = this.isModalOpen ? 'block' : 'none';
  }
}
window.CallWidget = CallWidgetSDK

