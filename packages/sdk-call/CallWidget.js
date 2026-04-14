const TOKEN_SERVER_URL = 'http://localhost:4000/token'
const TWILIO_SDK_URL = 'https://cdn.jsdelivr.net/npm/@twilio/voice-sdk@2/dist/twilio.min.js'

class CallWidget {
  constructor() {
    this._device = null
    this._activeCall = null
    this._sdkLoading = null
  }

  async fetchToken() {
    const res = await fetch(TOKEN_SERVER_URL)
    const { token } = await res.json()

    return token
  }

  _loadTwilioSDK() {
    if (window.Twilio) return Promise.resolve()
    if (this._sdkLoading) return this._sdkLoading

    this._sdkLoading = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = TWILIO_SDK_URL
      script.onload = resolve
      script.onerror = () => {
        this._sdkLoading = null
        reject(new Error('No se cargó el Twilio SDK'))
      }
      document.head.appendChild(script)
    })

    return this._sdkLoading
  }

  async _initDevice() {
    await this._loadTwilioSDK()
    const token = await this.fetchToken()
    this._device = new Twilio.Device(token, { logLevel: 1 })

    console.log(this._device)

    this._device.on('tokenWillExpire', async () => {
      try {
        const newToken = await this.fetchToken()
        this._device.updateToken(newToken)
      } catch (e) {
        console.warn('No se puede refrescar el token', e)
      }
    })
  }



}

window.addEventListener('sdk:call-requested', async () => {
  const widget = new CallWidget()
  widget._initDevice()
  console.log('inicializado')
})

window.CallWidget = CallWidget
