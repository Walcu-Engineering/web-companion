export default function IncomingCall({ onAccept, onReject, dealer, visitorId }) {
  return (
    <>
      <h2>Llamada entrante</h2>
      {
        dealer && <p className="call-meta">
          <span>Dealer</span> {dealer}
        </p>
      }
      {
        visitorId && <p className="call-meta">
          <span>Visitor</span> {visitorId}
        </p>
      }
      <div className="actions">
        <button className="btn-accept" onClick={onAccept}>Aceptar</button>
        <button className="btn-reject" onClick={onReject}>Rechazar</button>
      </div>
    </>
  )
}
