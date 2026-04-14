export default function ActiveCall({ onHangUp }) {
  return (
    <>
      <h2>En llamada</h2>
      <button className="btn-hangup" onClick={onHangUp}>Colgar</button>
    </>
  )
}
