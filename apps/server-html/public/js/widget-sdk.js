class CallWidgetSDK {
  constructor(config = {}) {
    this.phoneNumber = config.phoneNumber || '+34000000000';
    this.color = config.color || '#25D366';
    this.position = config.position || 'bottom-right';

    this.init();
  }

  init() {
    // avoid duplicate injections if case
    if (document.getElementById('mi-sdk-host')) return;

    // Create the private DOM host in the normal DOM
    // We create a shadow-root in this host
    const host = document.createElement('div');
    host.id = 'mi-sdk-host';

    // without this config host doesn't show
    host.style.position = 'fixed';
    host.style.bottom = '24px';
    host.style.right = '24px';
    host.style.zIndex = '2147483647';

    const shadow = host.attachShadow({ mode: 'open' });

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
      <a class="widget-btn" href="tel:${this.phoneNumber}" title="Llámanos">
        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
        </svg>
      </a>
    `;

    document.body.appendChild(host);
  }
}

window.CallWidget = CallWidgetSDK;
