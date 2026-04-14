export default function IncomingCall({ onAccept, onReject }) {
  return (
    <>
      <h2>Llamada entrante</h2>
      <div className="actions">
        <button className="btn-accept" onClick={onAccept}>Aceptar</button>
        <button className="btn-reject" onClick={onReject}>Rechazar</button>
      </div>
    </>
  )
}
