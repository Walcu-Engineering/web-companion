export default function ActiveCall({ onHangUp }) {
  return (
    <div>
      <p>En llamada</p>
      <button onClick={onHangUp}>Colgar</button>
    </div>
  )
}
