import { useState } from "react";

export function useTwilioDevice() {
  const [status, setStatus] = useState('idle')

  const accept = () => setStatus('in-call')
  const reject = () => setStatus('idle')
  const hangUp = () => setStatus('idle')


  return { status, accept, reject, hangUp }
}
