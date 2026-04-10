class CallWidget {
  constructor() {
    this._device = null
    this._activeCall = null
    this._config = {}
    this._refreshTimer = null

    window.addEventListener('sdk:call-requested', () => console.log('Hola!'))
  }
}
window.CallWidget = CallWidget
