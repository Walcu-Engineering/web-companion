const TOKEN_SERVER_URL = 'http://localhost:4000/token'

class CallWidget {
  constructor() {
    this._device = null
    this._activeCall = null
    this._config = {}
    this._refreshTimer = null
  }

  async fetchToken() {
    const res = await fetch(TOKEN_SERVER_URL)
    const { token } = await res.json()
    return token
  }
}

window.addEventListener('sdk:call-requested', async () => {
  const widget = new CallWidget()
  const token = await widget.fetchToken()
  console.log('Llamada solicitada con token:', token)
})

window.CallWidget = CallWidget
