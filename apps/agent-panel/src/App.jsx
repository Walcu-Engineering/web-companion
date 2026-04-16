import ActiveCall from "./components/ActiveCall";
import IdleScreen from "./components/IdleScreen";
import IncomingCall from "./components/IncomingCall";
import { useTwilioDevice } from "./hooks/useTwilioDevice";

export default function App() {
  const { status, callParams, accept, reject, hangUp } = useTwilioDevice()

  return (
    <div className="panel">
      {status === 'idle' && <IdleScreen />}
      {status === 'ringing' && <IncomingCall onAccept={accept} onReject={reject} dealer={callParams?.dealer} visitorId={callParams?.visitorId} />}
      {status === 'in-call' && <ActiveCall onHangUp={hangUp} dealer={callParams?.dealer} visitorId={callParams?.visitorId} />}
    </div>
  )
}
