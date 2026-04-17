export default function ActiveCall({ onHangUp, dealer, visitorId }) {
  return (
    <>
      <h2>En llamada</h2>
      {dealer && (
        <p className="call-meta">
          <span>Dealer</span> {dealer}
        </p>
      )}
      {visitorId && (
        <p className="call-meta">
          <span>Visitor</span> {visitorId}
        </p>
      )}
      <button className="btn-hangup" onClick={onHangUp}>
        Colgar
      </button>
    </>
  );
}
