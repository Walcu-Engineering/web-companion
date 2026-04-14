import { useEffect, useState } from "react";

export function useTwilioDevice() {

  const BACKEND_URL = 'http://localhost:3002/token'

  const [status, setStatus] = useState('idle')
  const callRef = useRef(null)

  useEffect(() => {
    async function setup() {
      const res = await fetch(BACKEND_URL)

      const { token } = await res.json()

      device = new Device(token, { logLevel: 1 })

      device.on('incoming', (call) => {
        callRef.current = call
        setStatus('ringing')

        call.on('cancel', () => setStatus('idle'))
        call.on('disconnect', () => setStatus('idle'))

        device.on('error', (err) => {
          console.error('Twilio Device error', err)
        })

      })
      await device.register()
    }

    setup().catch(console.error)

    return () => {
      device?.destroy()
    }

  })

  const accept = () => {
    callRef.current?.accept()
    setStatus('in-call')
  }
  const reject = () => {
    callRef.current?.reject()
    callRef.current = null
    setStatus('idle')
  }
  const hangUp = () => {
    callRef.current?.disconnect()
    callRef.current = null
    setStatus('idle')
  }


  return { status, accept, reject, hangUp }
}
