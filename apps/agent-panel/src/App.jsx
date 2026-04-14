import ActiveCall from "./components/ActiveCall";
import IdleScreen from "./components/IdleScreen";
import IncomingCall from "./components/IncomingCall";
import { useTwilioDevice } from "./hooks/useTwilioDevice";

export default function App() {
  const { status, accept, reject, hangUp } = useTwilioDevice()

  return (
    <div className="panel">
      {status === 'idle'    && <IdleScreen />}
      {status === 'ringing' && <IncomingCall onAccept={accept} onReject={reject} />}
      {status === 'in-call' && <ActiveCall onHangUp={hangUp} />}
    </div>
  )
}
