export default function Toast({ message }) {
  if (!message) return null
  return (
    <div className="toast" role="status">
      <span className="toast-dot" />
      <span>{message}</span>
    </div>
  )
}
