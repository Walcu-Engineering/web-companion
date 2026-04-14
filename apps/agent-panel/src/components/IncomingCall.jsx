export default function IncomingCall({ onAccept, onReject }) {
  return (
    <div>
      <p>Llamada entrante</p>
      <button onCLick={onAccept}>Aceptar</button>
      <button onCLick={onReject}>Rechazar</button>
    </div>
  )
}
