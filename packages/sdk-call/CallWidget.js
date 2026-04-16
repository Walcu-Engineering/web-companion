const SERVER_URL = 'http://localhost:4000'
const TOKEN_SERVER_URL = SERVER_URL + '/token'
const TWILIO_SDK_URL = 'https://cdn.jsdelivr.net/npm/@twilio/voice-sdk@2/dist/twilio.min.js'

const CLIENT_ID = window.__CALL_WIDGET_CLIENT_ID__ || null

function getOrCreateVisitorId() {
  const key = '_cwid'
  const existing = document.cookie
    .split('; ')
    .find(r => r.startsWith(`${key}=`))
    ?.split('=')[1]

  if (existing) return existing

  const id = crypto.randomUUID()
  document.cookie = `${key}=${id}; max-age=31536000; path=/; SameSite=Strict`
  return id
}

class CallWidget {
  constructor() {
    this._device = null
    this._activeCall = null

    this._sdkLoading = null

    this._accessToken = null
    this._refreshToken = null
    this._refreshTimer = null
  }

  async verify() {
    const res = await fetch(`${SERVER_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: CLIENT_ID })
    })

    if (!res.ok) throw new Error('SDK auth failed')

    const { accessToken, refreshToken } = await res.json()
    this._accessToken = accessToken
    this._refreshToken = refreshToken

    this._scheduleRefresh()

  }

  _scheduleRefresh() {
    clearTimeout(this._refreshTimer)
    this._refreshTimer = setTimeout(() => this._refreshAccessToken(), 1000 * 570)
  }

  async _refreshAccessToken() {
    try {
      const res = await fetch(`${SERVER_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this._refreshToken })
      })
      if (!res.ok) {
        // refreshToken expied, requested auth
        return this.verify()
      }
      const { accessToken } = await res.json()
      this._accessToken = accessToken
      this._scheduleRefresh()
    } catch (e) {
      console.warn('Token refresh failed', e)
    }
  }

  async fetchToken() {
    const visitorId = getOrCreateVisitorId()
    const res = await fetch(`${TOKEN_SERVER_URL}?visitorId=${visitorId}`, {
      headers: { 'Authorization': `Bearer ${this._accessToken}` }
    })

    // 401 token expired just need to refresh accessToken
    if (res.status === 401) {
      await this._refreshAccessToken()
      // recall with the new accessToken!
      return this.fetchToken()
    }
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
    this._device = new Twilio.Device(token)

    console.log('device init')
    this._device.on('tokenWillExpire', async () => {
      try {
        console.log('token expired updating...')
        const newToken = await this.fetchToken()
        this._device.updateToken(newToken)
      } catch (e) {
        console.warn('No se puede refrescar el token', e)
      }
    })
  }

  async _handleCallRequested() {
    if (this._activeCall) return

    if (!this._device) {
      try {
        await this._initDevice()
      } catch (e) {
        console.warn('Error inicializando device', e)
        window.dispatchEvent(new CustomEvent('sdk:call-error', { detail: e }))
        return
      }
    }

    window.dispatchEvent(new CustomEvent('sdk:call-connecting'))


    try {
      this._activeCall = await this._device.connect({
        params: {
          clientId: CLIENT_ID,
          visitorId: getOrCreateVisitorId()
        }
      })

      console.log('active call connected, waiting to accept')
      // the call is ringing on the agent's side
      this._activeCall.on('ringing', () => {
        console.log('ringing')
        window.dispatchEvent(new CustomEvent('sdk:call-ringing'))
      })

      // the agent accepted (answered) the call
      this._activeCall.on('accept', () => {
        console.log('accepted')
        window.dispatchEvent(new CustomEvent('sdk:call-started'))
      })

      // the other person or the client disconnected
      this._activeCall.on('disconnect', () => {
        window.dispatchEvent(new CustomEvent('sdk:call-ended'))
        this._activeCall = null
      })

      // some error on the call, alert UI
      this._activeCall.on('error', (e) => {
        window.dispatchEvent(new CustomEvent('sdk:call-error', { detail: e }))
        this._activeCall = null
      })
    } catch (e) {
      window.dispatchEvent(new CustomEvent('sdk:call-error', { detail: e }))
    }
  }


  hangUp() {
    if (this._activeCall) this._activeCall.disconnect()
  }

}

const _instance = new CallWidget()
_instance.verify().catch(e => console.warn(e))
window.addEventListener('sdk:call-requested', () => _instance._handleCallRequested())

window.addEventListener('sdk:hangup-requested', () => _instance.hangUp())

window.CallWidget = CallWidget
